import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

interface Service {
  name: string;
  image: string;
  ports: string;
  envVars: string;
  volumes: string;
  dependsOn: string;
}

@Component({
  selector: 'app-docker-compose-gen',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './docker-compose-gen.component.html',
  styleUrl: './docker-compose-gen.component.scss'
})
export class DockerComposeGenComponent {
  readonly services = signal<Service[]>([
    { name: 'app', image: 'node:20-alpine', ports: '3000:3000', envVars: 'NODE_ENV=production', volumes: './src:/app/src', dependsOn: '' }
  ]);
  readonly networkName = signal('app-network');
  readonly output = signal('');
  private readonly clipboard = inject(ClipboardService);

  readonly templates = signal([
    {
      label: 'Node.js + PostgreSQL',
      services: [
        { name: 'app', image: 'node:20-alpine', ports: '3000:3000', envVars: 'DATABASE_URL=postgresql://postgres:password@db:5432/myapp', volumes: './src:/app/src', dependsOn: 'db' },
        { name: 'db', image: 'postgres:16-alpine', ports: '5432:5432', envVars: 'POSTGRES_USER=postgres\nPOSTGRES_PASSWORD=password\nPOSTGRES_DB=myapp', volumes: 'pgdata:/var/lib/postgresql/data', dependsOn: '' },
      ]
    },
    {
      label: 'Python + Redis',
      services: [
        { name: 'app', image: 'python:3.12-slim', ports: '8000:8000', envVars: 'REDIS_URL=redis://cache:6379', volumes: './src:/app/src', dependsOn: 'cache' },
        { name: 'cache', image: 'redis:7-alpine', ports: '6379:6379', envVars: '', volumes: 'redisdata:/data', dependsOn: '' },
      ]
    },
    {
      label: 'PHP + MySQL',
      services: [
        { name: 'app', image: 'php:8.3-apache', ports: '8080:80', envVars: 'DB_HOST=db\nDB_NAME=myapp', volumes: './src:/var/www/html', dependsOn: 'db' },
        { name: 'db', image: 'mysql:8', ports: '3306:3306', envVars: 'MYSQL_ROOT_PASSWORD=root\nMYSQL_DATABASE=myapp\nMYSQL_USER=user\nMYSQL_PASSWORD=password', volumes: 'mysqldata:/var/lib/mysql', dependsOn: '' },
      ]
    },
    {
      label: 'Nginx + Node.js + MongoDB',
      services: [
        { name: 'nginx', image: 'nginx:alpine', ports: '80:80', envVars: '', volumes: './nginx.conf:/etc/nginx/nginx.conf:ro', dependsOn: 'app' },
        { name: 'app', image: 'node:20-alpine', ports: '3000:3000', envVars: 'MONGO_URL=mongodb://mongo:27017/myapp', volumes: './src:/app/src', dependsOn: 'mongo' },
        { name: 'mongo', image: 'mongo:7', ports: '27017:27017', envVars: 'MONGO_INITDB_ROOT_USERNAME=admin\nMONGO_INITDB_ROOT_PASSWORD=password', volumes: 'mongodata:/data/db', dependsOn: '' },
      ]
    },
  ]);

  addService(): void {
    this.services.set([...this.services(), {
      name: `service-${this.services().length + 1}`,
      image: 'alpine:latest',
      ports: '',
      envVars: '',
      volumes: '',
      dependsOn: ''
    }]);
  }

  removeService(index: number): void {
    const updated = this.services().filter((_, i) => i !== index);
    this.services.set(updated);
  }

  updateService(index: number, field: keyof Service, value: string): void {
    const updated = [...this.services()];
    updated[index] = { ...updated[index], [field]: value };
    this.services.set(updated);
  }

  applyTemplate(template: { services: Service[] }): void {
    this.services.set(template.services.map(s => ({ ...s })));
    this.generate();
  }

  generate(): void {
    const lines: string[] = ['version: "3.8"', '', 'services:'];

    for (const svc of this.services()) {
      lines.push(`  ${svc.name}:`);
      lines.push(`    image: ${svc.image}`);

      if (svc.ports) {
        lines.push(`    ports:`);
        for (const port of svc.ports.split('\n').filter(p => p.trim())) {
          lines.push(`      - "${port.trim()}"`);
        }
      }

      if (svc.envVars) {
        lines.push(`    environment:`);
        for (const env of svc.envVars.split('\n').filter(e => e.trim())) {
          const [key, ...valParts] = env.split('=');
          lines.push(`      ${key.trim()}: "${valParts.join('=').trim()}"`);
        }
      }

      if (svc.volumes) {
        lines.push(`    volumes:`);
        for (const vol of svc.volumes.split('\n').filter(v => v.trim())) {
          lines.push(`      - ${vol.trim()}`);
        }
      }

      if (svc.dependsOn) {
        lines.push(`    depends_on:`);
        for (const dep of svc.dependsOn.split('\n').filter(d => d.trim())) {
          lines.push(`      - ${dep.trim()}`);
        }
      }
    }

    const hasNamedVolumes = this.services().some(s =>
      s.volumes.split('\n').some(v => v.trim() && !v.trim().startsWith('.') && !v.trim().startsWith('/') && !v.trim().startsWith(':'))
    );

    if (hasNamedVolumes) {
      lines.push('', 'volumes:');
      const seen = new Set<string>();
      for (const svc of this.services()) {
        for (const vol of svc.volumes.split('\n').filter(v => v.trim())) {
          const name = vol.trim().split(':')[0].trim();
          if (!name.startsWith('.') && !name.startsWith('/') && !name.startsWith(':') && !seen.has(name)) {
            lines.push(`  ${name}:`);
            seen.add(name);
          }
        }
      }
    }

    if (this.networkName()) {
      lines.push('', 'networks:');
      lines.push(`  ${this.networkName()}:`);
      lines.push(`    driver: bridge`);
    }

    this.output.set(lines.join('\n'));
  }

  async copyOutput(): Promise<void> {
    await this.clipboard.copy(this.output());
  }

  clear(): void {
    this.services.set([
      { name: 'app', image: 'node:20-alpine', ports: '3000:3000', envVars: '', volumes: '', dependsOn: '' }
    ]);
    this.output.set('');
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      this.generate();
    }
  }
}
