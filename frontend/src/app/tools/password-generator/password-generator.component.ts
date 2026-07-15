import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

@Component({
  selector: 'app-password-generator',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './password-generator.component.html',
  styleUrl: './password-generator.component.scss'
})
export class PasswordGeneratorComponent {
  private readonly clipboard = inject(ClipboardService);

  readonly length = signal(16);
  readonly useUppercase = signal(true);
  readonly useLowercase = signal(true);
  readonly useNumbers = signal(true);
  readonly useSymbols = signal(true);
  readonly password = signal('');
  readonly strength = signal<'weak' | 'medium' | 'strong' | 'very-strong'>('very-strong');

  generate(): void {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (this.useUppercase()) chars += upper;
    if (this.useLowercase()) chars += lower;
    if (this.useNumbers()) chars += nums;
    if (this.useSymbols()) chars += syms;

    if (!chars) {
      this.password.set('Selecione ao menos um tipo de caractere');
      return;
    }

    let result = '';
    const len = this.length();
    const array = new Uint32Array(len);
    crypto.getRandomValues(array);

    for (let i = 0; i < len; i++) {
      result += chars[array[i] % chars.length];
    }

    this.password.set(result);
    this.updateStrength();
  }

  private updateStrength(): void {
    const len = this.length();
    const types = [this.useUppercase(), this.useLowercase(), this.useNumbers(), this.useSymbols()].filter(Boolean).length;

    if (len >= 16 && types >= 3) this.strength.set('very-strong');
    else if (len >= 12 && types >= 2) this.strength.set('strong');
    else if (len >= 8 && types >= 1) this.strength.set('medium');
    else this.strength.set('weak');
  }

  async copyPassword(): Promise<void> {
    if (this.password()) {
      await this.clipboard.copy(this.password());
    }
  }

  getStrengthLabel(): string {
    const labels: Record<string, string> = { weak: 'Fraca', medium: 'Média', strong: 'Forte', 'very-strong': 'Muito Forte' };
    return labels[this.strength()];
  }
}
