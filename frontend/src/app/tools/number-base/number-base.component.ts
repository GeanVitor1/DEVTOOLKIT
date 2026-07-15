import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

@Component({
  selector: 'app-number-base',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './number-base.component.html',
  styleUrl: './number-base.component.scss'
})
export class NumberBaseComponent {
  readonly input = signal('255');
  readonly fromBase = signal<2 | 8 | 10 | 16>(10);
  readonly bin = signal('');
  readonly oct = signal('');
  readonly dec = signal('');
  readonly hex = signal('');
  readonly error = signal('');

  constructor() {
    this.convert();
  }

  convert(): void {
    const text = this.input().trim();
    if (!text) {
      this.clear();
      return;
    }

    try {
      let decValue: number;

      switch (this.fromBase()) {
        case 2: decValue = parseInt(text, 2); break;
        case 8: decValue = parseInt(text, 8); break;
        case 10: decValue = parseInt(text, 10); break;
        case 16: decValue = parseInt(text, 16); break;
        default: throw new Error('Base inválida');
      }

      if (isNaN(decValue)) throw new Error('Valor inválido');

      this.bin.set(decValue.toString(2).toUpperCase());
      this.oct.set(decValue.toString(8));
      this.dec.set(decValue.toString());
      this.hex.set(decValue.toString(16).toUpperCase());
      this.error.set('');
    } catch {
      this.error.set('Valor inválido para a base selecionada');
      this.clear();
    }
  }

  setBase(base: 2 | 8 | 10 | 16): void {
    this.fromBase.set(base);
    this.convert();
  }

  private clear(): void {
    this.bin.set('');
    this.oct.set('');
    this.dec.set('');
    this.hex.set('');
  }
}
