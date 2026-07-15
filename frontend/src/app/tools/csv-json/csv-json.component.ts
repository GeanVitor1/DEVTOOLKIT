import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

@Component({
  selector: 'app-csv-json',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './csv-json.component.html',
  styleUrl: './csv-json.component.scss'
})
export class CsvJsonComponent {
  readonly input = signal('');
  readonly output = signal('');
  readonly mode = signal<'csv-to-json' | 'json-to-csv'>('csv-to-json');
  readonly delimiter = signal(',');
  readonly error = signal('');

  process(): void {
    const text = this.input();
    if (!text.trim()) {
      this.output.set('');
      this.error.set('');
      return;
    }

    try {
      if (this.mode() === 'csv-to-json') {
        this.output.set(this.csvToJson(text));
      } else {
        this.output.set(this.jsonToCsv(text));
      }
      this.error.set('');
    } catch (e: any) {
      this.error.set(e.message || 'Erro na conversão');
      this.output.set('');
    }
  }

  private csvToJson(csv: string): string {
    const lines = csv.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) throw new Error('CSV precisa de cabeçalho + ao menos 1 linha');

    const headers = this.parseLine(lines[0]);
    const result: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseLine(lines[i]);
      if (values.length === 0) continue;
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        const val = values[j] ?? '';
        const num = Number(val);
        obj[headers[j]] = isNaN(num) || val.trim() === '' ? val : num;
      }
      result.push(obj);
    }

    return JSON.stringify(result, null, 2);
  }

  private parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === this.delimiter() && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  private jsonToCsv(json: string): string {
    const data = JSON.parse(json);
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('JSON deve ser um array de objetos');
    }

    const headers = Object.keys(data[0]);
    const delim = this.delimiter();
    const lines: string[] = [headers.join(delim)];

    for (const row of data) {
      const values = headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        const str = String(val);
        if (str.includes(delim) || str.includes('"') || str.includes('\n')) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      });
      lines.push(values.join(delim));
    }

    return lines.join('\n');
  }

  swap(): void {
    const currentOutput = this.output();
    this.mode.set(this.mode() === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json');
    this.input.set(currentOutput);
    this.process();
  }

  clear(): void {
    this.input.set('');
    this.output.set('');
    this.error.set('');
  }
}
