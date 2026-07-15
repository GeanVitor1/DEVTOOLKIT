import { Injectable, signal } from '@angular/core';

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly visible = signal(false);
  readonly data = signal<ToastData>({ message: '', type: 'info' });
  private timer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: ToastData['type'] = 'success', duration = 2500): void {
    this.data.set({ message, type });
    this.visible.set(true);
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.visible.set(false), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 4000);
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  hide(): void {
    this.visible.set(false);
    if (this.timer) clearTimeout(this.timer);
  }
}
