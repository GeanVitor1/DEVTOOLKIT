import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { format } from 'sql-formatter';

@Component({
  selector: 'app-sql-formatter',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './sql-formatter.component.html',
  styleUrl: './sql-formatter.component.scss'
})
export class SqlFormatterComponent {
  readonly input = signal('SELECT * FROM users WHERE age > 18 ORDER BY name');
  readonly dialect = signal('postgresql');
  readonly caseStyle = signal<'upper' | 'lower'>('upper');
  readonly indent = signal(2);

  readonly dialects = [
    { value: 'bigquery', label: 'BigQuery' },
    { value: 'db2', label: 'DB2' },
    { value: 'db2i', label: 'DB2 iSeries' },
    { value: 'hive', label: 'Hive' },
    { value: 'mariadb', label: 'MariaDB' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'n1ql', label: 'N1QL' },
    { value: 'plsql', label: 'Oracle PL/SQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'redshift', label: 'Redshift' },
    { value: 'singlestoredb', label: 'SingleStoreDB' },
    { value: 'snowflake', label: 'Snowflake' },
    { value: 'spark', label: 'Spark' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'transactsql', label: 'SQL Server' },
    { value: 'trino', label: 'Trino' },
  ];

  readonly formatted = computed(() => {
    try {
      return format(this.input(), {
        language: this.dialect(),
        keywordCase: this.caseStyle() === 'upper' ? 'upper' : 'lower',
        indent: ' '.repeat(this.indent()),
      } as never);
    } catch {
      return 'Error: Invalid SQL';
    }
  });

  readonly minified = computed(() => {
    return this.input()
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([,;()])\s*/g, '$1')
      .trim();
  });

  readonly statusLine = computed(() => {
    const lines = this.formatted().split('\n').length;
    const chars = this.formatted().length;
    const label = this.dialects.find(d => d.value === this.dialect())?.label || this.dialect();
    return `${lines} lines - ${chars} chars - ${label}`;
  });

  setExample(): void {
    this.input.set('SELECT u.id, u.name, COUNT(o.id) AS order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.created_at > \'2024-01-01\'\n  AND u.active = true\nGROUP BY u.id, u.name\nHAVING COUNT(o.id) > 5\nORDER BY order_count DESC\nLIMIT 10;');
  }

  clear(): void {
    this.input.set('');
  }
}
