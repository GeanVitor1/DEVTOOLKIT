import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

@Component({
  selector: 'app-qr-code',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.scss'
})
export class QrCodeComponent {
  readonly input = signal('');
  readonly qrUrl = signal('');
  readonly size = signal(250);
  readonly error = signal('');

  generate(): void {
    const text = this.input().trim();
    if (!text) {
      this.qrUrl.set('');
      this.error.set('');
      return;
    }

    const encoded = encodeURIComponent(text);
    this.qrUrl.set(`https://api.qrserver.com/v1/create-qr-code/?size=${this.size()}x${this.size()}&data=${encoded}`);
    this.error.set('');
  }

  setSize(size: number): void {
    this.size.set(size);
    if (this.input()) this.generate();
  }

  clear(): void {
    this.input.set('');
    this.qrUrl.set('');
    this.error.set('');
  }
}
