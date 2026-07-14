import { Component, input, signal, inject } from '@angular/core';
import { ClipboardService } from '../services/clipboard.service';

@Component({
  selector: 'app-copy-button',
  standalone: true,
  templateUrl: './copy-button.component.html',
  styleUrl: './copy-button.component.scss'
})
export class CopyButtonComponent {
  readonly value = input('');
  readonly label = input('Copy');
  readonly size = input<'sm' | 'md'>('sm');
  readonly copied = signal(false);
  private readonly clipboard = inject(ClipboardService);

  async onCopy(): Promise<void> {
    const ok = await this.clipboard.copy(this.value());
    if (ok) {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }
}
