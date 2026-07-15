import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

interface PermBits {
  r: boolean;
  w: boolean;
  x: boolean;
}

@Component({
  selector: 'app-chmod-calculator',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './chmod-calculator.component.html',
  styleUrl: './chmod-calculator.component.scss'
})
export class ChmodCalculatorComponent {
  readonly owner = signal<PermBits>({ r: true, w: true, x: true });
  readonly group = signal<PermBits>({ r: true, w: false, x: true });
  readonly other = signal<PermBits>({ r: true, w: false, x: true });
  readonly sticky = signal(false);
  readonly setuid = signal(false);
  readonly setgid = signal(false);

  readonly octal = computed(() => {
    const special =
      (this.setuid() ? 4 : 0) +
      (this.setgid() ? 2 : 0) +
      (this.sticky() ? 1 : 0);
    const o = this.bitsToNum(this.owner());
    const g = this.bitsToNum(this.group());
    const t = this.bitsToNum(this.other());
    if (special > 0) return `${special}${o}${g}${t}`;
    return `${o}${g}${t}`;
  });

  readonly symbolic = computed(() => {
    const s =
      (this.setuid() ? 'u+s,' : '') +
      (this.setgid() ? 'g+s,' : '') +
      (this.sticky() ? 'o+t,' : '');
    const body =
      'u=' + this.bitsToSym(this.owner()) +
      ',g=' + this.bitsToSym(this.group()) +
      ',o=' + this.bitsToSym(this.other());
    return (s + body).replace(/,$/, '');
  });

  readonly lsStyle = computed(() => {
    const special = this.setuid() || this.setgid() || this.sticky();
    let mode = '-';
    mode += this.bitsToRwX(this.owner(), this.setuid(), 's', 'S');
    mode += this.bitsToRwX(this.group(), this.setgid(), 's', 'S');
    mode += this.bitsToRwX(this.other(), this.sticky(), 't', 'T');
    return special ? mode : mode;
  });

  readonly command = computed(() => `chmod ${this.octal()} path`);

  toggle(who: 'owner' | 'group' | 'other', bit: keyof PermBits): void {
    const map = { owner: this.owner, group: this.group, other: this.other };
    const current = map[who]();
    map[who].set({ ...current, [bit]: !current[bit] });
  }

  setPreset(octal: string): void {
    const padded = octal.padStart(4, '0');
    const special = parseInt(padded[0], 10);
    this.setuid.set((special & 4) !== 0);
    this.setgid.set((special & 2) !== 0);
    this.sticky.set((special & 1) !== 0);
    this.owner.set(this.numToBits(parseInt(padded[1], 10)));
    this.group.set(this.numToBits(parseInt(padded[2], 10)));
    this.other.set(this.numToBits(parseInt(padded[3], 10)));
  }

  private bitsToNum(b: PermBits): number {
    return (b.r ? 4 : 0) + (b.w ? 2 : 0) + (b.x ? 1 : 0);
  }

  private numToBits(n: number): PermBits {
    return { r: (n & 4) !== 0, w: (n & 2) !== 0, x: (n & 1) !== 0 };
  }

  private bitsToSym(b: PermBits): string {
    return (b.r ? 'r' : '') + (b.w ? 'w' : '') + (b.x ? 'x' : '') || '-';
  }

  private bitsToRwX(b: PermBits, special: boolean, lower: string, upper: string): string {
    const r = b.r ? 'r' : '-';
    const w = b.w ? 'w' : '-';
    let x = b.x ? 'x' : '-';
    if (special) x = b.x ? lower : upper;
    return r + w + x;
  }
}
