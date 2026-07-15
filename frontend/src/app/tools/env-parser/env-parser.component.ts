import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

interface EnvEntry {
  key: string;
  value: string;
  line: number;
  issue?: string;
}

@Component({
  selector: 'app-env-parser',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './env-parser.component.html',
  styleUrl: './env-parser.component.scss'
})
export class EnvParserComponent {
  readonly input = signal(`# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=admin
DB_PASSWORD="s3cret!"

# API
API_URL=https://api.example.com
API_KEY=sk_live_abc123
NODE_ENV=development
`);
  readonly entries = signal<EnvEntry[]>([]);
  readonly errors = signal<string[]>([]);
  readonly mode = signal<'table' | 'json' | 'export'>('table');

  constructor() {
    this.parse();
  }

  parse(): void {
    const text = this.input();
    const lines = text.split(/\r?\n/);
    const entries: EnvEntry[] = [];
    const errors: string[] = [];
    const seen = new Set<string>();

    lines.forEach((raw, idx) => {
      const line = raw.trim();
      if (!line || line.startsWith('#')) return;

      const eq = line.indexOf('=');
      if (eq === -1) {
        errors.push(`Linha ${idx + 1}: falta '='`);
        return;
      }

      let key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();

      if (key.startsWith('export ')) {
        key = key.slice(7).trim();
      }

      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
        errors.push(`Linha ${idx + 1}: chave inválida "${key}"`);
      }

      if (seen.has(key)) {
        errors.push(`Linha ${idx + 1}: chave duplicada "${key}"`);
      }
      seen.add(key);

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      let issue: string | undefined;
      if (/password|secret|token|key|api_key/i.test(key) && value.length < 8) {
        issue = 'Valor curto para segredo';
      }

      entries.push({ key, value, line: idx + 1, issue });
    });

    this.entries.set(entries);
    this.errors.set(errors);
  }

  toJson(): string {
    const obj: Record<string, string> = {};
    for (const e of this.entries()) obj[e.key] = e.value;
    return JSON.stringify(obj, null, 2);
  }

  toExport(): string {
    return this.entries()
      .map(e => {
        const needsQuote = /[\s#"']/.test(e.value);
        const val = needsQuote ? `"${e.value.replace(/"/g, '\\"')}"` : e.value;
        return `${e.key}=${val}`;
      })
      .join('\n');
  }

  clear(): void {
    this.input.set('');
    this.entries.set([]);
    this.errors.set([]);
  }
}
