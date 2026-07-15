import { Component, inject, signal, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

@Component({
  selector: 'app-jwt-encoder',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './jwt-encoder.component.html',
  styleUrl: './jwt-encoder.component.scss'
})
export class JwtEncoderComponent {
  readonly header = signal(JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2));
  readonly payload = signal(JSON.stringify({
    sub: '1234567890',
    name: 'João Silva',
    iat: Math.floor(Date.now() / 1000)
  }, null, 2));
  readonly secret = signal('your-256-bit-secret');
  readonly token = signal('');
  readonly error = signal('');
  private readonly clipboard = inject(ClipboardService);

  private async hmacSign(data: string, secret: string, algo: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const hashName = algo === 'HS384' ? 'SHA-384' : algo === 'HS512' ? 'SHA-512' : 'SHA-256';

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: { name: hashName } },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    return this.base64UrlEncode(new Uint8Array(signature));
  }

  private base64UrlEncode(data: Uint8Array): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    const bytes = data;
    for (let i = 0; i < bytes.length; i += 3) {
      const b1 = bytes[i];
      const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
      const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;
      result += chars[b1 >> 2];
      result += chars[((b1 & 3) << 4) | (b2 >> 4)];
      result += i + 1 < bytes.length ? chars[((b2 & 15) << 2) | (b3 >> 6)] : '=';
      result += i + 2 < bytes.length ? chars[b3 & 63] : '=';
    }
    return result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private base64UrlEncodeStr(str: string): string {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async encode(): Promise<void> {
    this.error.set('');
    this.token.set('');

    try {
      const headerObj = JSON.parse(this.header());
      const payloadObj = JSON.parse(this.payload());
      const secretVal = this.secret();

      if (!secretVal) {
        this.error.set('A chave secreta é obrigatória');
        return;
      }

      const encodedHeader = this.base64UrlEncodeStr(JSON.stringify(headerObj));
      const encodedPayload = this.base64UrlEncodeStr(JSON.stringify(payloadObj));

      const signature = await this.hmacSign(
        `${encodedHeader}.${encodedPayload}`,
        secretVal,
        headerObj.alg || 'HS256'
      );

      this.token.set(`${encodedHeader}.${encodedPayload}.${signature}`);
    } catch (e: any) {
      this.error.set(e.message || 'Erro ao codificar JWT');
    }
  }

  loadSample(): void {
    this.header.set(JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2));
    this.payload.set(JSON.stringify({
      sub: '1234567890',
      name: 'João Silva',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }, null, 2));
    this.secret.set('my-super-secret-key-256');
    this.encode();
  }

  async copyToken(): Promise<void> {
    await this.clipboard.copy(this.token());
  }

  clear(): void {
    this.header.set(JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2));
    this.payload.set('{}');
    this.secret.set('');
    this.token.set('');
    this.error.set('');
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      this.encode();
    }
  }
}
