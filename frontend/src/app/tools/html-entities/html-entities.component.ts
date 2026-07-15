import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

@Component({
  selector: 'app-html-entities',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './html-entities.component.html',
  styleUrl: './html-entities.component.scss'
})
export class HtmlEntitiesComponent {
  readonly input = signal('');
  readonly output = signal('');
  readonly mode = signal<'encode' | 'decode'>('encode');
  readonly error = signal('');

  process(): void {
    const text = this.input();
    if (!text.trim()) {
      this.output.set('');
      this.error.set('');
      return;
    }

    try {
      if (this.mode() === 'encode') {
        this.output.set(this.encodeEntities(text));
      } else {
        this.output.set(this.decodeEntities(text));
      }
      this.error.set('');
    } catch {
      this.error.set('Erro ao processar a entrada');
      this.output.set('');
    }
  }

  private encodeEntities(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, c => map[c] || c);
  }

  private decodeEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  swap(): void {
    const currentOutput = this.output();
    this.mode.set(this.mode() === 'encode' ? 'decode' : 'encode');
    this.input.set(currentOutput);
    this.process();
  }

  clear(): void {
    this.input.set('');
    this.output.set('');
    this.error.set('');
  }
}
