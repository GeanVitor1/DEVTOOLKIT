import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

@Component({
  selector: 'app-json-to-ts',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './json-to-ts.component.html',
  styleUrl: './json-to-ts.component.scss'
})
export class JsonToTsComponent {
  readonly input = signal('');
  readonly interfaceName = signal('RootObject');
  readonly useOptional = signal(true);
  readonly useType = signal(false);
  readonly output = signal('');
  readonly error = signal('');
  private readonly clipboard = inject(ClipboardService);

  convert(): void {
    this.error.set('');
    this.output.set('');

    try {
      const parsed = JSON.parse(this.input());
      const typeName = this.interfaceName() || 'RootObject';
      const result = this.generateType(parsed, typeName, 0);
      this.output.set(result);
    } catch (e: any) {
      this.error.set(e.message || 'JSON inválido');
    }
  }

  private generateType(obj: any, name: string, indent: number): string {
    const pad = '  '.repeat(indent);
    const padInner = '  '.repeat(indent + 1);

    if (Array.isArray(obj)) {
      if (obj.length === 0) return 'any[]';
      return `Array<${this.getTypeName(obj[0], name + 'Item', indent)}>`;
    }

    if (obj === null) return 'null';
    if (typeof obj !== 'object') return this.getPrimitiveType(obj);

    const lines: string[] = [];
    const exportKw = indent === 0 ? 'export ' : '';

    if (this.useType()) {
      lines.push(`${pad}${exportKw}type ${name} = {`);
    } else {
      lines.push(`${pad}${exportKw}interface ${name} {`);
    }

    for (const [key, value] of Object.entries(obj)) {
      const optional = this.useOptional() && (value === null || value === undefined) ? '?' : '';
      const tsType = this.getTypeName(value, this.capitalize(key), indent + 1);

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nested = this.generateType(value, this.capitalize(key), indent + 1);
        lines.push(`${padInner}${key}${optional}: ${this.useType() ? this.capitalize(key) : this.capitalize(key)}`);
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        lines.push(`${padInner}${key}${optional}: ${this.generateType(value, this.capitalize(key) + 'Item', indent + 1)}`);
      } else {
        lines.push(`${padInner}${key}${optional}: ${tsType};`);
      }
    }

    lines.push(`${pad}}`);
    return lines.join('\n');
  }

  private getTypeName(value: any, fallback: string, indent: number): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'any[]';
      return `Array<${this.getTypeName(value[0], fallback + 'Item', indent)}>`;
    }
    return this.getPrimitiveType(value);
  }

  private getPrimitiveType(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number';
    if (typeof value === 'boolean') return 'boolean';
    return 'any';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  loadSample(): void {
    this.input.set(JSON.stringify({
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "active": true,
      "score": 9.5,
      "address": {
        "street": "Rua Principal",
        "number": 123,
        "city": "São Paulo",
        "zip": "01000-000"
      },
      "tags": ["admin", "user"],
      "projects": [
        { "id": 101, "name": "Projeto A", "completed": false }
      ]
    }, null, 2));
    this.convert();
  }

  async copyOutput(): Promise<void> {
    await this.clipboard.copy(this.output());
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
      this.convert();
    }
  }
}
