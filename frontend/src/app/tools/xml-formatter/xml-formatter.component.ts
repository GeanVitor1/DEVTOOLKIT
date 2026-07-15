import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

@Component({
  selector: 'app-xml-formatter',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './xml-formatter.component.html',
  styleUrl: './xml-formatter.component.scss'
})
export class XmlFormatterComponent {
  readonly input = signal('');
  readonly output = signal('');
  readonly mode = signal<'format' | 'minify'>('format');
  readonly error = signal('');

  process(): void {
    const text = this.input();
    if (!text.trim()) {
      this.output.set('');
      this.error.set('');
      return;
    }

    try {
      this.parseXml(text);
      if (this.mode() === 'format') {
        this.output.set(this.formatXml(text));
      } else {
        this.output.set(this.minifyXml(text));
      }
      this.error.set('');
    } catch (e: any) {
      this.error.set('XML inválido: ' + (e.message || 'erro de formatação'));
      this.output.set('');
    }
  }

  private parseXml(xml: string): Document {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) throw new Error(errorNode.textContent || 'Erro de parsing');
    return doc;
  }

  private formatXml(xml: string): string {
    const doc = this.parseXml(xml);
    const serializer = new XMLSerializer();
    const serialized = serializer.serializeToString(doc);
    const cleaned = serialized.replace(/ xmlns=""/g, '');
    return this.indentXml(cleaned);
  }

  private indentXml(xml: string): string {
    let indent = 0;
    const lines: string[] = [];
    const tokens = xml.replace(/>\s*</g, '>\n<').split('\n');

    for (let line of tokens) {
      line = line.trim();
      if (!line) continue;

      if (line.startsWith('<?xml')) {
        lines.push(line);
        continue;
      }

      if (line.startsWith('</')) {
        indent--;
      }

      lines.push('  '.repeat(Math.max(0, indent)) + line);

      if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>') && !line.startsWith('<?') && !line.startsWith('<!')) {
        indent++;
      }
    }

    return lines.join('\n');
  }

  private minifyXml(xml: string): string {
    return xml.replace(/>\s+</g, '><').trim();
  }

  clear(): void {
    this.input.set('');
    this.output.set('');
    this.error.set('');
  }
}
