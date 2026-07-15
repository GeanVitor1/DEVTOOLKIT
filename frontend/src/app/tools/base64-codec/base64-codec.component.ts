import { Component, signal, inject, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-base64-codec',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './base64-codec.component.html',
  styleUrl: './base64-codec.component.scss'
})
export class Base64CodecComponent {
  private readonly storage = inject(StorageService);

  readonly input = signal('');
  readonly output = signal('');
  readonly mode = signal<'encode' | 'decode'>('encode');
  readonly error = signal('');
  private readonly clipboard = new ClipboardService();

  constructor() {
    const saved = this.storage.load<{ input: string; mode: string }>('base64');
    if (saved) {
      this.input.set(saved.input || '');
      this.mode.set(saved.mode as any || 'encode');
    }
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
        this.output.set(btoa(unescape(encodeURIComponent(text))));
      } else {
        this.output.set(decodeURIComponent(escape(atob(text))));
      }
      this.error.set('');
      this.storage.save('base64', { input: this.input(), mode: this.mode() });
    } catch (e) {
      this.error.set(this.mode() === 'decode' ? 'Entrada Base64 inválida' : 'Erro ao codificar');
      this.output.set('');
    }
  }

  swap(): void {
    const currentOutput = this.output();
    this.mode.set(this.mode() === 'encode' ? 'decode' : 'encode');
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

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      this.process();
    }
  }
}
