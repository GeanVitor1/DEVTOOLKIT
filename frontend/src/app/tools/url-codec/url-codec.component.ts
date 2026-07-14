import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

@Component({
  selector: 'app-url-codec',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './url-codec.component.html',
  styleUrl: './url-codec.component.scss'
})
export class UrlCodecComponent {
  readonly input = signal('https://example.com/search?q=hello world&lang=pt-BR&ref=dev toolkit');
  readonly output = signal('');
  readonly mode = signal<'encode' | 'decode'>('encode');
  readonly encodeType = signal<'component' | 'full'>('component');
  readonly error = signal('');
  private readonly clipboard = new ClipboardService();

  constructor() {
    this.process();
  }

  process(): void {
    const text = this.input();
    if (!text.trim()) {
      this.output.set('');
      this.error.set('');
      return;
    }

    try {
      if (this.mode() === 'encode') {
        if (this.encodeType() === 'component') {
          this.output.set(encodeURIComponent(text));
        } else {
          this.output.set(encodeURI(text));
        }
      } else {
        this.output.set(decodeURIComponent(text));
      }
      this.error.set('');
    } catch {
      this.error.set(this.mode() === 'decode' ? 'URL inválida para decodificar' : 'Erro ao codificar');
      this.output.set('');
    }
  }

  swap(): void {
    const out = this.output();
    this.mode.set(this.mode() === 'encode' ? 'decode' : 'encode');
    this.input.set(out);
    this.process();
  }

  parseQueryString(): void {
    const text = this.input();
    try {
      const url = new URL(text);
      const params: string[] = [];
      url.searchParams.forEach((value, key) => {
        params.push(`${key} = ${value}`);
      });
      this.output.set(params.join('\n'));
      this.error.set('');
    } catch {
      this.error.set('Não foi possível extrair query params');
    }
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
