import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiConfigService {
  /**
   * Base URL for the .NET API (no trailing slash).
   * Dev: '' + proxy.conf.json → localhost backend
   * Prod: NG_APP_API_URL or '' with Vercel /api rewrite
   */
  readonly baseUrl = (environment.apiBaseUrl || '').replace(/\/$/, '');

  /** Absolute or relative API path, e.g. /api/proxy */
  url(path: string): string {
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${p}`;
  }

  get proxyUrl(): string {
    return this.url('/api/proxy');
  }

  get healthUrl(): string {
    return this.url('/health');
  }
}
