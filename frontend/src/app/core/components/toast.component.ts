import { Component, signal } from '@angular/core';

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  readonly visible = signal(false);
  readonly data = signal<ToastData>({ message: '', type: 'info' });
  private timer: ReturnType<typeof setTimeout> | null = null;

  show(data: ToastData, duration = 3000): void {
    this.data.set(data);
    this.visible.set(true);
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.visible.set(false), duration);
  }

  hide(): void {
    this.visible.set(false);
    if (this.timer) clearTimeout(this.timer);
  }
}
