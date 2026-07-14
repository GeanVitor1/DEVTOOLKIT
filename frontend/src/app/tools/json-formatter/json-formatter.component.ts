import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';


interface JsonTreeNode {
  key: string;
  value: unknown;
  type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';
  children?: JsonTreeNode[];
  expanded: boolean;
}

@Component({
  selector: 'app-json-formatter',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './json-formatter.component.html',
  styleUrl: './json-formatter.component.scss'
})
export class JsonFormatterComponent {
  readonly input = signal(`{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@test.com",\n  "address": {\n    "city": "New York",\n    "zip": "10001"\n  },\n  "tags": ["developer", "designer"]\n}`);
  readonly jsonpathQuery = signal('');
  readonly jsonpathResult = signal('');

  readonly activeAction = signal<'format' | 'minify' | 'input'>('format');

  readonly parsed = computed(() => {
    try {
      return { ok: true as const, data: JSON.parse(this.input()) };
    } catch {
      return { ok: false as const, error: 'Invalid JSON' };
    }
  });

  readonly formatted = computed(() => {
    const p = this.parsed();
    if (!p.ok) return '';
    return JSON.stringify(p.data, null, 2);
  });

  readonly minified = computed(() => {
    const p = this.parsed();
    if (!p.ok) return '';
    return JSON.stringify(p.data);
  });

  readonly output = computed(() => {
    const active = this.activeAction();
    if (active === 'format') return this.formatted();
    if (active === 'minify') return this.minified();
    return this.input();
  });

  readonly statusLine = computed(() => {
    const p = this.parsed();
    if (!p.ok) return '- Invalid JSON';
    const str = JSON.stringify(p.data);
    const lines = this.formatted().split('\n').length;
    return `Valid JSON - ${lines} lines - ${str.length} chars`;
  });

  readonly isValid = computed(() => this.parsed().ok);

  private buildTree(key: string, value: unknown): JsonTreeNode {
    if (value === null) {
      return { key, value: null, type: 'null', expanded: true };
    }
    if (Array.isArray(value)) {
      return {
        key,
        value,
        type: 'array',
        expanded: true,
        children: value.map((v, i) => this.buildTree(String(i), v))
      };
    }
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      return {
        key,
        value,
        type: 'object',
        expanded: true,
        children: entries.map(([k, v]) => this.buildTree(k, v))
      };
    }
    return { key, value, type: typeof value as JsonTreeNode['type'], expanded: true };
  }

  getTree(): JsonTreeNode[] {
    const p = this.parsed();
    if (!p.ok) return [];
    return [this.buildTree('root', p.data)];
  }

  toggleNode(node: JsonTreeNode): void {
    node.expanded = !node.expanded;
    this.input.update(v => v);
  }

  setFormat(): void {
    this.activeAction.set('format');
    const p = this.parsed();
    if (p.ok) this.input.set(this.formatted());
  }

  setMinify(): void {
    this.activeAction.set('minify');
    const p = this.parsed();
    if (p.ok) this.input.set(this.minified());
  }

  validate(): void {
    this.activeAction.set('format');
    const p = this.parsed();
    if (p.ok) this.input.set(this.formatted());
  }

  clear(): void {
    this.input.set('');
    this.jsonpathQuery.set('');
    this.jsonpathResult.set('');
    this.activeAction.set('input');
  }

  setExample(): void {
    this.input.set(`{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@test.com",\n  "address": {\n    "city": "New York",\n    "zip": "10001"\n  },\n  "tags": ["developer", "designer"]\n}`);
    this.activeAction.set('format');
  }

  queryJsonpath(): void {
    const q = this.jsonpathQuery().trim();
    if (!q) { this.jsonpathResult.set(''); return; }
    const p = this.parsed();
    if (!p.ok) { this.jsonpathResult.set('Invalid JSON'); return; }
    try {
      const result = this.evaluateJsonpath(p.data, q);
      this.jsonpathResult.set(JSON.stringify(result, null, 2));
    } catch {
      this.jsonpathResult.set('Invalid JSONPath expression');
    }
  }

  private evaluateJsonpath(obj: unknown, path: string): unknown {
    const parts = path.replace(/^\$\.?/, '').split(/\.|\[(\d+)\]/).filter(Boolean);
    let current: unknown = obj;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      if (typeof current === 'object' && part in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return current;
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      null: 'null',
      object: 'object',
      array: 'array'
    };
    return labels[type] || type;
  }

  getValuePreview(node: JsonTreeNode): string {
    if (node.type === 'object') return '{...}';
    if (node.type === 'array') return '[...]';
    if (node.type === 'string') return `"${String(node.value)}"`;
    return String(node.value);
  }
}
