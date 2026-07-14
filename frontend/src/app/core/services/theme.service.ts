import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(true);

  constructor() {
    const stored = localStorage.getItem('dtk-theme');
    if (stored === 'light' || stored === 'dark') {
      this.isDark.set(stored === 'dark');
    }
    this.apply();
  }

  toggle(): void {
    this.isDark.update(v => !v);
    this.apply();
  }

  private apply(): void {
    const theme = this.isDark() ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dtk-theme', theme);
  }
}
