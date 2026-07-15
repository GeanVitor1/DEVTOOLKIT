import { Component, signal, inject, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { StorageService } from '../../core/services/storage.service';
import { ApiConfigService } from '../../core/services/api-config.service';


interface KeyValueRow {
  key: string;
  value: string;
  enabled: boolean;
}

interface ResponseData {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  timingMs: number;
  sizeBytes: number;
}

interface ProxyApiResponse {
  statusCode: number;
  headers?: Record<string, string> | null;
  body?: string | null;
  timingMs: number;
  sizeBytes: number;
}

type Tab = 'params' | 'headers' | 'auth' | 'body';
type AuthType = 'none' | 'bearer' | 'basic' | 'api-key';

@Component({
  selector: 'app-http-client',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './http-client.component.html',
  styleUrl: './http-client.component.scss'
})
export class HttpClientComponent {
  readonly method = signal('GET');
  readonly url = signal('');
  readonly activeTab = signal<Tab>('headers');
  readonly authType = signal<AuthType>('none');
  readonly authValue = signal('');
  readonly bodyContent = signal('');
  readonly bodyType = signal<'json' | 'text'>('json');
  /** When true, request goes through DevToolkit .NET proxy (avoids browser CORS). */
  readonly useProxy = signal(true);

  readonly headers = signal<KeyValueRow[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ]);
  readonly params = signal<KeyValueRow[]>([]);

  readonly tabs: { id: Tab; label: string }[] = [
    { id: 'params', label: 'Params' },
    { id: 'headers', label: 'Headers' },
    { id: 'auth', label: 'Auth' },
    { id: 'body', label: 'Body' },
  ];

  readonly loading = signal(false);
  readonly response = signal<ResponseData | null>(null);
  readonly error = signal<string | null>(null);

  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly api = inject(ApiConfigService);

  constructor() {
    const saved = this.storage.load<{ method: string; url: string; body: string }>('http-last');
    if (saved) {
      this.method.set(saved.method || 'GET');
      this.url.set(saved.url || '');
      this.bodyContent.set(saved.body || '');
    }
  }

  get methods(): string[] {
    return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
  }

  get authTypes(): { value: AuthType; label: string }[] {
    return [
      { value: 'none', label: 'No Auth' },
      { value: 'bearer', label: 'Bearer Token' },
      { value: 'basic', label: 'Basic Auth' },
      { value: 'api-key', label: 'API Key' }
    ];
  }

  addHeader(): void {
    this.headers.update(h => [...h, { key: '', value: '', enabled: true }]);
  }

  removeHeader(index: number): void {
    this.headers.update(h => h.filter((_, i) => i !== index));
  }

  addParam(): void {
    this.params.update(p => [...p, { key: '', value: '', enabled: true }]);
  }

  removeParam(index: number): void {
    this.params.update(p => p.filter((_, i) => i !== index));
  }

  async send(): Promise<void> {
    if (!this.url().trim()) return;

    this.loading.set(true);
    this.response.set(null);
    this.error.set(null);

    try {
      const result = await this.executeRequest();
      this.response.set(result);
      this.storage.save('http-last', { method: this.method(), url: this.url(), body: this.bodyContent() });
    } catch (err: unknown) {
      this.error.set(err instanceof Error ? err.message : 'Request failed');
    } finally {
      this.loading.set(false);
    }
  }

  private async executeRequest(): Promise<ResponseData> {
    if (this.useProxy()) {
      return this.executeViaProxy();
    }
    return this.executeDirect();
  }

  /** Sends through backend POST /api/proxy (Render) — recommended in production. */
  private async executeViaProxy(): Promise<ResponseData> {
    const targetUrl = this.buildUrl();
    if (!/^https?:\/\//i.test(targetUrl)) {
      throw new Error('URL deve ser absoluta (https://...) para o proxy');
    }

    const startTime = performance.now();
    try {
      const payload = {
        method: this.method(),
        url: targetUrl,
        headers: this.buildHeaders(),
        body: this.buildBody(),
        timeoutMs: 30000
      };

      const result = await lastValueFrom(
        this.http.post<ProxyApiResponse>(this.api.proxyUrl, payload)
      );

      return {
        statusCode: result.statusCode,
        headers: result.headers ?? {},
        body: result.body ?? '',
        timingMs: result.timingMs || Math.round(performance.now() - startTime),
        sizeBytes: result.sizeBytes || new Blob([result.body ?? '']).size
      };
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'status' in err) {
        const httpErr = err as { status: number; error?: unknown; message?: string };
        const body =
          typeof httpErr.error === 'string'
            ? httpErr.error
            : JSON.stringify(httpErr.error ?? { error: 'Proxy request failed' });
        if (httpErr.status === 0 || httpErr.status === 504) {
          throw new Error(
            'Não foi possível alcançar a API. Verifique se o backend no Render está online e se NG_APP_API_URL / rewrite da Vercel estão corretos.'
          );
        }
        return {
          statusCode: httpErr.status || 502,
          headers: {},
          body,
          timingMs: Math.round(performance.now() - startTime),
          sizeBytes: 0
        };
      }
      throw err;
    }
  }

  /** Browser-direct request (may fail with CORS). */
  private async executeDirect(): Promise<ResponseData> {
    const url = this.buildUrl();
    const headers = this.buildHeaders();
    const body = this.buildBody();
    const startTime = performance.now();

    try {
      const response = await lastValueFrom(
        this.http.request(this.method(), url, {
          headers,
          body,
          observe: 'response',
          responseType: 'text'
        })
      );

      const endTime = performance.now();
      const responseHeaders: Record<string, string> = {};
      response.headers.keys().forEach(key => {
        responseHeaders[key] = response.headers.get(key) || '';
      });

      const bodyStr = typeof response.body === 'string' ? response.body : JSON.stringify(response.body);

      return {
        statusCode: response.status,
        headers: responseHeaders,
        body: bodyStr,
        timingMs: Math.round(endTime - startTime),
        sizeBytes: new Blob([bodyStr]).size
      };
    } catch (err: unknown) {
      const endTime = performance.now();
      if (err && typeof err === 'object' && 'status' in err) {
        const httpErr = err as { status: number; error?: unknown };
        return {
          statusCode: httpErr.status,
          headers: {},
          body: JSON.stringify(httpErr.error) || 'Error response',
          timingMs: Math.round(endTime - startTime),
          sizeBytes: 0
        };
      }
      throw err;
    }
  }

  private buildUrl(): string {
    const base = this.url().trim();
    const activeParams = this.params().filter(p => p.enabled && p.key);
    if (activeParams.length === 0) return base;

    const searchParams = new URLSearchParams();
    activeParams.forEach(p => searchParams.append(p.key, p.value));
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}${searchParams.toString()}`;
  }

  private buildHeaders(): Record<string, string> {
    const result: Record<string, string> = {};
    const activeHeaders = this.headers().filter(h => h.enabled && h.key);

    activeHeaders.forEach(h => { result[h.key] = h.value; });

    if (this.authType() === 'bearer' && this.authValue()) {
      result['Authorization'] = `Bearer ${this.authValue()}`;
    } else if (this.authType() === 'basic' && this.authValue()) {
      const encoded = btoa(this.authValue());
      result['Authorization'] = `Basic ${encoded}`;
    } else if (this.authType() === 'api-key' && this.authValue()) {
      result['X-API-Key'] = this.authValue();
    }

    return result;
  }

  private buildBody(): string | null {
    if (this.method() === 'GET' || this.method() === 'HEAD') return null;
    if (!this.bodyContent().trim()) return null;

    if (this.bodyType() === 'json') {
      try {
        const parsed = JSON.parse(this.bodyContent());
        return JSON.stringify(parsed);
      } catch {
        return this.bodyContent();
      }
    }
    return this.bodyContent();
  }

  copyAsCurl(): void {
    let curl = `curl -X ${this.method()}`;
    const headers = this.buildHeaders();
    Object.entries(headers).forEach(([k, v]) => {
      curl += ` -H "${k}: ${v}"`;
    });
    if (this.bodyContent()) {
      const escaped = this.bodyContent().replace(/"/g, '\\"');
      curl += ` -d "${escaped}"`;
    }
    curl += ` "${this.buildUrl()}"`;
    navigator.clipboard.writeText(curl);
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  getHeaderCount(headers: Record<string, string>): number {
    return Object.keys(headers).length;
  }

  getHeaderEntries(headers: Record<string, string>): { key: string; value: string }[] {
    return Object.entries(headers).map(([key, value]) => ({ key, value }));
  }

  getStatusColor(code: number): string {
    if (code >= 200 && code < 300) return 'var(--dtk-success)';
    if (code >= 300 && code < 400) return 'var(--dtk-info)';
    if (code >= 400 && code < 500) return 'var(--dtk-warning)';
    return 'var(--dtk-error)';
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      this.send();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
