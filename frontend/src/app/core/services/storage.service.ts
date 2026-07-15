import { Injectable } from '@angular/core';

const PREFIX = 'dtk-';

@Injectable({ providedIn: 'root' })
export class StorageService {
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(data));
    } catch {}
  }

  load<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  }
}
