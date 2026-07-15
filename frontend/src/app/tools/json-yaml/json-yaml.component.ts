import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

@Component({
  selector: 'app-json-yaml',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './json-yaml.component.html',
  styleUrl: './json-yaml.component.scss'
})
export class JsonYamlComponent {
  readonly input = signal('');
  readonly output = signal('');
  readonly mode = signal<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml');
  readonly error = signal('');
  private readonly clipboard = inject(ClipboardService);

  process(): void {
    const text = this.input();
    if (!text.trim()) {
      this.output.set('');
      this.error.set('');
      return;
    }

    try {
      if (this.mode() === 'json-to-yaml') {
        const obj = JSON.parse(text);
        this.output.set(this.toYaml(obj, 0));
      } else {
        const obj = this.parseYaml(text);
        this.output.set(JSON.stringify(obj, null, 2));
      }
      this.error.set('');
    } catch (e: any) {
      this.error.set(e.message || 'Erro ao converter');
      this.output.set('');
    }
  }

  private toYaml(obj: any, indent: number): string {
    const pad = '  '.repeat(indent);

    if (obj === null || obj === undefined) return 'null';

    if (typeof obj === 'string') {
      if (obj === '') return "''";
      if (/[:\n#"']/.test(obj) || obj.trim() !== obj) {
        return JSON.stringify(obj);
      }
      return obj;
    }

    if (typeof obj === 'number') {
      if (!Number.isFinite(obj)) return String(obj);
      return String(obj);
    }

    if (typeof obj === 'boolean') return obj ? 'true' : 'false';

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      const lines: string[] = [];
      for (const item of obj) {
        if (typeof item === 'object' && item !== null) {
          lines.push(`${pad}-`);
          const nested = this.toYaml(item, indent + 1).split('\n');
          for (const line of nested) {
            lines.push(indent > 0 ? `${pad}  ${line.trimStart()}` : `${pad}${line}`);
          }
        } else {
          lines.push(`${pad}- ${this.toYaml(item, 0)}`);
        }
      }
      return lines.join('\n');
    }

    if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      if (keys.length === 0) return '{}';
      const lines: string[] = [];
      for (const key of keys) {
        const val = obj[key];
        const safeKey = /[:\s]/.test(key) ? `"${key}"` : key;
        if (typeof val === 'object' && val !== null) {
          lines.push(`${pad}${safeKey}:`);
          const nested = this.toYaml(val, indent + 1);
          if (nested) {
            for (const nLine of nested.split('\n')) {
              lines.push(nLine);
            }
          }
        } else {
          lines.push(`${pad}${safeKey}: ${this.toYaml(val, 0)}`);
        }
      }
      return lines.join('\n');
    }

    return String(obj);
  }

  private lines: string[] = [];
  private lineIdx = 0;

  private parseYaml(yaml: string): any {
    this.lines = yaml.split('\n');
    this.lineIdx = 0;
    const result = this.parseValue(0);
    return result ?? null;
  }

  private peek(): { indent: number; content: string; raw: string } | null {
    while (this.lineIdx < this.lines.length) {
      const raw = this.lines[this.lineIdx];
      const trimmed = raw.trim();
      if (trimmed === '' || trimmed.startsWith('#')) {
        this.lineIdx++;
        continue;
      }
      const indent = raw.length - raw.trimStart().length;
      return { indent, content: trimmed, raw };
    }
    return null;
  }

  private consume(): { indent: number; content: string; raw: string } | null {
    const line = this.peek();
    if (line) this.lineIdx++;
    return line;
  }

  private parseValue(minIndent: number): any {
    const line = this.peek();
    if (!line) return null;

    if (line.content.startsWith('- ')) {
      return this.parseSequence(minIndent);
    }

    const colonIdx = this.findColon(line.content);
    if (colonIdx >= 0) {
      return this.parseMapping(minIndent);
    }

    this.consume();
    return this.parseScalar(line.content);
  }

  private parseSequence(minIndent: number): any[] {
    const result: any[] = [];

    while (true) {
      const line = this.peek();
      if (!line || line.indent < minIndent) break;

      if (line.content.startsWith('- ')) {
        this.consume();
        const valStr = line.content.slice(2).trim();

        if (valStr === '') {
          const next = this.peek();
          if (next && next.indent > line.indent) {
            result.push(this.parseValue(line.indent + 1));
          } else {
            result.push(null);
          }
        } else {
          const next = this.peek();
          if (next && next.indent > line.indent) {
            result.push(this.parseValue(line.indent + 1));
          } else {
            result.push(this.parseScalar(valStr));
          }
        }
      } else if (line.content.startsWith('-')) {
        this.consume();
        const valStr = line.content.slice(1).trim();
        result.push(this.parseScalar(valStr));
      } else {
        const colonIdx = this.findColon(line.content);
        if (colonIdx >= 0 && line.indent >= minIndent) {
          result.push(this.parseMapping(minIndent));
        }
        break;
      }
    }

    return result;
  }

  private parseMapping(minIndent: number): Record<string, any> {
    const result: Record<string, any> = {};

    while (true) {
      const line = this.peek();
      if (!line || line.indent < minIndent) break;

      const colonIdx = this.findColon(line.content);
      if (colonIdx < 0) break;

      this.consume();
      const key = this.parseScalar(line.content.slice(0, colonIdx).trim());
      const rest = line.content.slice(colonIdx + 1).trim();

      if (rest === '') {
        const next = this.peek();
        if (next && next.indent > line.indent) {
          result[key] = this.parseValue(line.indent + 1);
        } else {
          result[key] = null;
        }
      } else {
        result[key] = this.parseScalar(rest);
      }
    }

    return result;
  }

  private findColon(line: string): number {
    let inQuote = false;
    let quoteChar = '';
    for (let i = 0; i < line.length; i++) {
      if (inQuote) {
        if (line[i] === quoteChar && (i === 0 || line[i - 1] !== '\\')) {
          inQuote = false;
        }
      } else {
        if (line[i] === '"' || line[i] === "'") {
          inQuote = true;
          quoteChar = line[i];
        } else if (line[i] === ':') {
          return i;
        }
      }
    }
    return -1;
  }

  private parseScalar(val: string): any {
    if (!val) return '';
    if (val === 'null' || val === '~') return null;
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (val === 'yes' || val === 'on') return true;
    if (val === 'no' || val === 'off') return false;
    if (/^-?\d+(\.\d+)?$/.test(val)) return Number(val);
    if (/^-?\d+\.\d+[eE][+-]?\d+$/.test(val)) return Number(val);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      const inner = val.slice(1, -1);
      if (val.startsWith('"')) {
        return inner.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');
      }
      return inner;
    }
    return val;
  }

  swap(): void {
    const currentOutput = this.output();
    this.mode.set(this.mode() === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml');
    this.input.set(currentOutput);
    this.process();
  }

  async copyOutput(): Promise<void> {
    await this.clipboard.copy(this.output());
  }

  clear(): void {
    this.input.set('');
    this.output.set('');
    this.error.set('');
  }
}
