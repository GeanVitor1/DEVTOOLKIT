import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

@Component({
  selector: 'app-color-converter',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './color-converter.component.html',
  styleUrl: './color-converter.component.scss'
})
export class ColorConverterComponent {
  readonly hex = signal('#38bdf8');
  readonly r = signal(56);
  readonly g = signal(189);
  readonly b = signal(248);
  readonly h = signal(199);
  readonly s = signal(93);
  readonly l = signal(60);
  readonly alpha = signal(1);
  private readonly clipboard = inject(ClipboardService);

  constructor() {
    this.updateFromHex();
  }

  updateFromHex(): void {
    const hex = this.hex().replace('#', '');
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      this.r.set(r); this.g.set(g); this.b.set(b);
    } else if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        this.r.set(r); this.g.set(g); this.b.set(b);
      }
    }
    this.updateHSL();
  }

  updateFromRGB(): void {
    const r = Math.min(255, Math.max(0, this.r()));
    const g = Math.min(255, Math.max(0, this.g()));
    const b = Math.min(255, Math.max(0, this.b()));
    this.r.set(r); this.g.set(g); this.b.set(b);
    this.hex.set(this.rgbToHex(r, g, b));
    this.updateHSL();
  }

  private updateHSL(): void {
    const r = this.r() / 255;
    const g = this.g() / 255;
    const b = this.b() / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    if (max === min) {
      this.h.set(0); this.s.set(0);
    } else {
      const d = max - min;
      this.s.set(l > 0.5 ? d / (2 - max - min) : d / (max + min));
      switch (max) {
        case r: this.h.set(((g - b) / d + (g < b ? 6 : 0)) / 6 * 360); break;
        case g: this.h.set(((b - r) / d + 2) / 6 * 360); break;
        case b: this.h.set(((r - g) / d + 4) / 6 * 360); break;
      }
    }
    this.l.set(l * 100);
    this.s.set(Math.round(this.s() * 100));
    this.h.set(Math.round(this.h()));
  }

  updateFromHSL(): void {
    const h = this.h() / 360;
    const s = this.s() / 100;
    const l = this.l() / 100;

    if (s === 0) {
      const v = Math.round(l * 255);
      this.r.set(v); this.g.set(v); this.b.set(v);
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      this.r.set(Math.round(hue2rgb(p, q, h + 1/3) * 255));
      this.g.set(Math.round(hue2rgb(p, q, h) * 255));
      this.b.set(Math.round(hue2rgb(p, q, h - 1/3) * 255));
    }

    this.hex.set(this.rgbToHex(this.r(), this.g(), this.b()));
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  get cssColor(): string {
    return `rgb(${this.r()}, ${this.g()}, ${this.b()})`;
  }

  get hslColor(): string {
    return `hsl(${this.h()}, ${this.s()}%, ${this.l()}%)`;
  }

  async copyColor(value: string): Promise<void> {
    await this.clipboard.copy(value);
  }

  setHexFromPicker(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.hex.set(input.value);
    this.updateFromHex();
  }
}
