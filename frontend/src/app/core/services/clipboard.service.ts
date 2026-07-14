import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  async copy(value: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    }
  }
}
