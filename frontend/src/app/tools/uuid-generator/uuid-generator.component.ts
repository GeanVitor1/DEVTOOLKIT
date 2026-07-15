import { Component, signal, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

import { ClipboardService } from '../../core/services/clipboard.service';

@Component({
  selector: 'app-uuid-generator',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './uuid-generator.component.html',
  styleUrl: './uuid-generator.component.scss'
})
export class UuidGeneratorComponent {
  readonly version = signal<'v1' | 'v4' | 'v7'>('v4');
  readonly format = signal<'dashed' | 'curly' | 'upper'>('dashed');
  readonly quantity = signal(5);
  readonly uuids = signal<string[]>([]);
  private readonly clipboard = inject(ClipboardService);

  setVersion(v: string): void {
    if (v === 'v1' || v === 'v4' || v === 'v7') this.version.set(v as 'v1' | 'v4' | 'v7');
  }

  setFormat(f: string): void {
    if (f === 'dashed' || f === 'curly' || f === 'upper') this.format.set(f as 'dashed' | 'curly' | 'upper');
  }

  setQuantity(val: string): void {
    const n = Number(val);
    this.quantity.set(Math.min(Math.max(n, 1), 100));
  }

  generate(): void {
    const qty = Math.min(Math.max(this.quantity(), 1), 100);
    const list: string[] = [];
    for (let i = 0; i < qty; i++) {
      list.push(this.generateOne());
    }
    this.uuids.set(list);
  }

  private generateOne(): string {
    let uuid: string;
    switch (this.version()) {
      case 'v1':
        uuid = this.generateV1();
        break;
      case 'v4':
        uuid = crypto.randomUUID();
        break;
      case 'v7':
        uuid = this.generateV7();
        break;
    }
    return this.applyFormat(uuid!);
  }

  private generateV1(): string {
    const now = Date.now();
    const timeHex = now.toString(16).padStart(12, '0');
    const clockSeq = Math.floor(Math.random() * 16384).toString(16).padStart(4, '0');
    const node = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
    return `${timeHex.substring(0, 8)}-${timeHex.substring(8, 12)}-1${clockSeq.substring(1, 4)}-${(Math.floor(Math.random() * 256) & 0x3f | 0x80).toString(16)}${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}-${node}`;
  }

  private generateV7(): string {
    const now = Date.now();
    const timeHex = now.toString(16).padStart(12, '0');
    const randA = Math.floor(Math.random() * 4096).toString(16).padStart(3, '0');
    const randB = (Math.floor(Math.random() * 16384) & 0x3fff | 0x8000).toString(16).padStart(4, '0');
    const rest = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
    return `${timeHex.substring(0, 8)}-${timeHex.substring(8, 12)}-7${randA.substring(0, 2)}-${randB.substring(0, 4)}-${rest}`;
  }

  private applyFormat(uuid: string): string {
    const upper = uuid.toUpperCase();
    switch (this.format()) {
      case 'curly':
        return '{' + upper + '}';
      case 'upper':
        return upper;
      case 'dashed':
      default:
        return uuid;
    }
  }

  async copyAll(): Promise<void> {
    await this.clipboard.copy(this.uuids().join('\n'));
  }

  download(): void {
    const blob = new Blob([this.uuids().join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uuids-' + this.version() + '-' + Date.now() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      this.generate();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
