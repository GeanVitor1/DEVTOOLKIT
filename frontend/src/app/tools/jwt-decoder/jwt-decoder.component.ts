import { Component, signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';


@Component({
  selector: 'app-jwt-decoder',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './jwt-decoder.component.html',
  styleUrl: './jwt-decoder.component.scss'
})
export class JwtDecoderComponent {
  readonly token = signal('');
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  readonly decoded = computed(() => {
    const t = this.token().trim();
    if (!t) return null;
    const parts = t.split('.');
    if (parts.length !== 3) return { error: 'Invalid JWT format. Expected 3 parts separated by dots.' };

    try {
      const header = this.parseBase64(parts[0]);
      const payload = this.parseBase64(parts[1]);
      const signature = parts[2];
      return { header, payload, signature, ok: true as const };
    } catch {
      return { error: 'Invalid JWT: could not decode base64 segments.' };
    }
  });

  readonly headerJson = computed(() => {
    const d = this.decoded();
    if (!d || 'error' in d) return '';
    return JSON.stringify(d.header, null, 2);
  });

  readonly payloadJson = computed(() => {
    const d = this.decoded();
    if (!d || 'error' in d) return '';
    return JSON.stringify(d.payload, null, 2);
  });

  readonly payloadEntries = computed(() => {
    const d = this.decoded();
    if (!d || 'error' in d) return [];
    return Object.entries(d.payload).map(([key, value]) => {
      const display = this.formatClaimValue(key, value);
      return { key, value, display };
    });
  });

  readonly expiration = computed(() => {
    const d = this.decoded();
    if (!d || 'error' in d) return null;
    const exp = d.payload['exp'];
    if (!exp || typeof exp !== 'number') return null;
    return new Date(exp * 1000);
  });

  readonly remaining = computed(() => {
    const exp = this.expiration();
    if (!exp) return null;
    const now = Date.now();
    const diff = exp.getTime() - now;
    if (diff <= 0) return { expired: true as const, text: 'Expired' };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { expired: false as const, text: `${h}h ${m}m ${s}s` };
  });

  readonly isExpired = computed(() => this.remaining()?.expired ?? false);

  readonly verifyStatus = computed(() => {
    const d = this.decoded();
    if (!d || 'error' in d) return null;
    const alg = d.header['alg'] as string;
    if (alg === 'none') return { ok: false, text: 'Algorithm is "none" - insecure!' };
    if (alg?.startsWith('HS')) return { ok: true, text: '⚠️ Cannot verify HMAC signatures (client-side). Use a secret key server-side.' };
    if (alg?.startsWith('RS') || alg?.startsWith('ES')) return { ok: true, text: 'Signature format valid. Use a public key to verify.' };
    return { ok: true, text: 'Signature present.' };
  });

  readonly isValid = computed(() => {
    const d = this.decoded();
    return d !== null && !('error' in d);
  });

  constructor() {
    effect(() => {
      if (this.isValid()) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    });
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.token.update(t => t);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private parseBase64(str: string): Record<string, unknown> {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = 4 - (padded.length % 4);
    const full = pad < 4 ? padded + '='.repeat(pad) : padded;
    const decoded = atob(full);
    return JSON.parse(decoded);
  }

  private formatClaimValue(key: string, value: unknown): string {
    if ((key === 'exp' || key === 'iat' || key === 'nbf') && typeof value === 'number') {
      const date = new Date(value * 1000);
      return date.toLocaleString();
    }
    return JSON.stringify(value);
  }

  paste(): void {
    navigator.clipboard.readText().then(t => this.token.set(t));
  }

  clear(): void {
    this.token.set('');
  }

  setExample(): void {
    this.token.set('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTksInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  }

  getHeaderEntries(header: Record<string, unknown>): { key: string; value: unknown }[] {
    return Object.entries(header).map(([key, value]) => ({ key, value }));
  }
}
