import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

interface ParsedPart {
  key: string;
  value: string;
}

@Component({
  selector: 'app-url-parser',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './url-parser.component.html',
  styleUrl: './url-parser.component.scss'
})
export class UrlParserComponent {
  readonly input = signal('https://api.example.com:443/v1/users?page=1&sort=name&q=dev%20tools#profile');
  readonly parts = signal<ParsedPart[]>([]);
  readonly queryParams = signal<ParsedPart[]>([]);
  readonly error = signal('');

  constructor() {
    this.parse();
  }

  parse(): void {
    const text = this.input().trim();
    if (!text) {
      this.parts.set([]);
      this.queryParams.set([]);
      this.error.set('');
      return;
    }

    try {
      const url = new URL(text);
      this.parts.set([
        { key: 'href', value: url.href },
        { key: 'protocol', value: url.protocol.replace(':', '') },
        { key: 'username', value: url.username || '(none)' },
        { key: 'password', value: url.password ? '••••••' : '(none)' },
        { key: 'hostname', value: url.hostname },
        { key: 'port', value: url.port || '(default)' },
        { key: 'origin', value: url.origin },
        { key: 'pathname', value: url.pathname },
        { key: 'search', value: url.search || '(none)' },
        { key: 'hash', value: url.hash || '(none)' },
      ]);

      const params: ParsedPart[] = [];
      url.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });
      this.queryParams.set(params);
      this.error.set('');
    } catch {
      this.error.set('URL inválida. Inclua o protocolo (https://...).');
      this.parts.set([]);
      this.queryParams.set([]);
    }
  }

  clear(): void {
    this.input.set('');
    this.parts.set([]);
    this.queryParams.set([]);
    this.error.set('');
  }

  asJson(): string {
    const obj: Record<string, string> = {};
    for (const p of this.parts()) {
      if (p.value !== '(none)' && p.value !== '(default)') obj[p.key] = p.value;
    }
    if (this.queryParams().length) {
      obj['query'] = JSON.stringify(
        Object.fromEntries(this.queryParams().map(p => [p.key, p.value]))
      );
    }
    return JSON.stringify(obj, null, 2);
  }
}
