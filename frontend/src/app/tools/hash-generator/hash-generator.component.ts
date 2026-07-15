import { Component, signal, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';

interface HashResult {
  algo: Algorithm;
  hash: string;
}

@Component({
  selector: 'app-hash-generator',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './hash-generator.component.html',
  styleUrl: './hash-generator.component.scss'
})
export class HashGeneratorComponent {
  readonly input = signal('');
  readonly selectedAlgos = signal<Algorithm[]>(['SHA-256']);
  readonly results = signal<HashResult[]>([]);
  readonly inputMode = signal<'text' | 'hex'>('text');
  private readonly clipboard = new ClipboardService();

  readonly allAlgorithms: Algorithm[] = ['SHA-1', 'SHA-256', 'SHA-512'];

  toggleAlgo(algo: Algorithm): void {
    const current = this.selectedAlgos();
    if (current.includes(algo)) {
      if (current.length > 1) {
        this.selectedAlgos.set(current.filter(a => a !== algo));
      }
    } else {
      this.selectedAlgos.set([...current, algo]);
    }
  }

  isAlgoSelected(algo: Algorithm): boolean {
    return this.selectedAlgos().includes(algo);
  }

  async generate(): Promise<void> {
    const text = this.input();
    if (!text.trim()) return;

    const algorithms = this.selectedAlgos();
    const hashes: HashResult[] = [];

    for (const algo of algorithms) {
      const hash = await this.computeHash(text, algo);
      hashes.push({ algo, hash });
    }

    this.results.set(hashes);
  }

  private async computeHash(text: string, algo: Algorithm): Promise<string> {
    let data: Uint8Array;

    if (this.inputMode() === 'hex') {
      const bytes = text.replace(/\s/g, '').match(/.{1,2}/g);
      if (!bytes) return '';
      data = new Uint8Array(bytes.map(b => parseInt(b, 16)));
    } else {
      const encoder = new TextEncoder();
      data = encoder.encode(text);
    }

    const arrayBuffer = new ArrayBuffer(data.length);
    new Uint8Array(arrayBuffer).set(data);
    const hashBuffer = await crypto.subtle.digest(algo, arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async copyHash(hash: string): Promise<void> {
    await this.clipboard.copy(hash);
  }

  async copyAll(): Promise<void> {
    const all = this.results().map(r => `${r.algo}: ${r.hash}`).join('\n');
    await this.clipboard.copy(all);
  }

  clear(): void {
    this.input.set('');
    this.results.set([]);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      this.generate();
    }
  }
}
