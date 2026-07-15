import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-password-generator',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './password-generator.component.html',
  styleUrl: './password-generator.component.scss'
})
export class PasswordGeneratorComponent {
  private readonly storage = inject(StorageService);

  readonly length = signal(16);
  readonly count = signal(1);
  readonly useUppercase = signal(true);
  readonly useLowercase = signal(true);
  readonly useNumbers = signal(true);
  readonly useSymbols = signal(true);
  readonly excludeAmbiguous = signal(false);
  readonly passwords = signal<string[]>([]);
  private readonly clipboard = inject(ClipboardService);

  constructor() {
    const saved = this.storage.load<{ length: number; count: number; useUppercase: boolean; useLowercase: boolean; useNumbers: boolean; useSymbols: boolean }>('password-opts');
    if (saved) {
      this.length.set(saved.length ?? 16);
      this.count.set(saved.count ?? 1);
      this.useUppercase.set(saved.useUppercase ?? true);
      this.useLowercase.set(saved.useLowercase ?? true);
      this.useNumbers.set(saved.useNumbers ?? true);
      this.useSymbols.set(saved.useSymbols ?? true);
    }
  }

  private readonly uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly lowercase = 'abcdefghijklmnopqrstuvwxyz';
  private readonly numbers = '0123456789';
  private readonly symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  private readonly ambiguous = 'il1Lo0O';

  readonly entropy = computed(() => {
    let charset = '';
    if (this.useUppercase()) charset += this.uppercase;
    if (this.useLowercase()) charset += this.lowercase;
    if (this.useNumbers()) charset += this.numbers;
    if (this.useSymbols()) charset += this.symbols;
    if (this.excludeAmbiguous()) {
      charset = charset.split('').filter(c => !this.ambiguous.includes(c)).join('');
    }
    if (charset.length === 0) return 0;
    return Math.floor(this.length() * Math.log2(charset.length));
  });

  readonly strength = computed(() => {
    const bits = this.entropy();
    if (bits < 28) return { label: 'Fraca', color: 'var(--dtk-error)', percent: 20 };
    if (bits < 50) return { label: 'Média', color: 'var(--dtk-warning)', percent: 45 };
    if (bits < 70) return { label: 'Forte', color: 'var(--dtk-info)', percent: 70 };
    return { label: 'Muito Forte', color: 'var(--dtk-success)', percent: 100 };
  });

  generate(): void {
    let charset = '';
    if (this.useUppercase()) charset += this.uppercase;
    if (this.useLowercase()) charset += this.lowercase;
    if (this.useNumbers()) charset += this.numbers;
    if (this.useSymbols()) charset += this.symbols;
    if (this.excludeAmbiguous()) {
      charset = charset.split('').filter(c => !this.ambiguous.includes(c)).join('');
    }
    if (!charset) charset = this.lowercase;

    const result: string[] = [];
    for (let i = 0; i < this.count(); i++) {
      let pw = '';
      const arr = new Uint32Array(this.length());
      crypto.getRandomValues(arr);
      for (let j = 0; j < this.length(); j++) {
        pw += charset[arr[j] % charset.length];
      }
      result.push(pw);
    }
    this.passwords.set(result);
    this.storage.save('password-opts', {
      length: this.length(), count: this.count(),
      useUppercase: this.useUppercase(), useLowercase: this.useLowercase(),
      useNumbers: this.useNumbers(), useSymbols: this.useSymbols()
    });
  }

  async copyPassword(pw: string): Promise<void> {
    await this.clipboard.copy(pw);
  }

  async copyAll(): Promise<void> {
    await this.clipboard.copy(this.passwords().join('\n'));
  }

  clear(): void {
    this.passwords.set([]);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      this.generate();
    }
  }
}
