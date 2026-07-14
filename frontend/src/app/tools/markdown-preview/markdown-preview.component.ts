import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-markdown-preview',
  imports: [FormsModule],
  templateUrl: './markdown-preview.component.html',
  styleUrl: './markdown-preview.component.scss'
})
export class MarkdownPreviewComponent {
  readonly input = signal(`# Hello World

Este é um **exemplo** de Markdown com \`código inline\`.

## Lista de itens

- Item 1
- Item 2
- Item 3

### Código

\`\`\`javascript
function saudacao(nome) {
  return \`Olá, \${nome}!\`;
}
\`\`\*

> Esta é uma citação em bloco.

| Coluna 1 | Coluna 2 |
|----------|----------|
| Dado A   | Dado B   |

[Link de exemplo](https://example.com)
`);

  readonly preview = computed<SafeHtml>(() => {
    return this.sanitizer.bypassSecurityTrustHtml(this.parseMarkdown(this.input()));
  });

  private readonly sanitizer: DomSanitizer;

  constructor(sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  private parseMarkdown(text: string): string {
    let html = text;

    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre class="md-code"><code class="lang-${lang || 'text'}">${escaped}</code></pre>`;
    });

    html = html.replace(/`([^`]+)`/g, '<code class="md-inline">$1</code>');

    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    html = html.replace(/^\> (.+)$/gm, '<blockquote>$1</blockquote>');

    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    html = html.replace(/^\- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    html = html.replace(/^\|(.+)\|$/gm, (_, cells) => {
      const cols = cells.split('|').map((c: string) => c.trim());
      if (cols.every((c: string) => /^[\s-]+$/.test(c))) return '';
      return '<tr>' + cols.map((c: string) => `<td>${c}</td>`).join('') + '</tr>';
    });
    html = html.replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>');

    html = html.replace(/\n{2,}/g, '</p><p>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p>\s*<(h[1-3]|pre|ul|blockquote|table)/g, '<$1');
    html = html.replace(/<\/(h[1-3]|pre|ul|blockquote|table)>\s*<\/p>/g, '</$1>');
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
  }
}
