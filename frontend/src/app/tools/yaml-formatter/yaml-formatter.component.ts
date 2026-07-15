import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';
import * as yaml from 'js-yaml';

@Component({
  selector: 'app-yaml-formatter',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './yaml-formatter.component.html',
  styleUrl: './yaml-formatter.component.scss'
})
export class YamlFormatterComponent {
  readonly input = signal('');
  readonly indent = signal(2);
  readonly mode = signal<'yaml' | 'json'>('yaml');
  readonly output = signal('');
  readonly error = signal('');
  private readonly clipboard = inject(ClipboardService);

  format(): void {
    this.error.set('');
    this.output.set('');

    const text = this.input();
    if (!text.trim()) return;

    try {
      if (this.mode() === 'yaml') {
        const parsed = yaml.load(text);
        this.output.set(yaml.dump(parsed, {
          indent: this.indent(),
          lineWidth: -1,
          noRefs: true,
          sortKeys: false,
        }));
      } else {
        const parsed = yaml.load(text);
        this.output.set(JSON.stringify(parsed, null, this.indent()));
      }
    } catch (e: any) {
      this.error.set(e.message || 'Erro ao processar');
    }
  }

  convertToJson(): void {
    const text = this.input();
    if (!text.trim()) return;
    try {
      const parsed = yaml.load(text);
      this.output.set(JSON.stringify(parsed, null, this.indent()));
      this.mode.set('json');
    } catch (e: any) {
      this.error.set(e.message || 'Erro ao converter');
    }
  }

  convertToYaml(): void {
    const text = this.input();
    if (!text.trim()) return;
    try {
      const parsed = JSON.parse(text);
      this.output.set(yaml.dump(parsed, {
        indent: this.indent(),
        lineWidth: -1,
        noRefs: true,
      }));
      this.mode.set('yaml');
    } catch (e: any) {
      this.error.set(e.message || 'JSON inválido');
    }
  }

  loadSample(): void {
    this.input.set(`server:
  host: localhost
  port: 3000
  debug: false

database:
  driver: postgresql
  host: db.example.com
  port: 5432
  name: myapp
  credentials:
    username: admin
    password: secret

cache:
  - redis
  - memcached

features:
  auth: true
  logging: true
  metrics: false`);
    this.format();
  }

  async copyOutput(): Promise<void> {
    await this.clipboard.copy(this.output());
  }

  async copyInput(): Promise<void> {
    await this.clipboard.copy(this.input());
  }

  clear(): void {
    this.input.set('');
    this.output.set('');
    this.error.set('');
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      this.format();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.input.set(reader.result as string);
    };
    reader.readAsText(file);
  }
}
