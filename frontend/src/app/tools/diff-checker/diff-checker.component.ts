import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  content: string;
  oldLineNum: number | null;
  newLineNum: number | null;
}

@Component({
  selector: 'app-diff-checker',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './diff-checker.component.html',
  styleUrl: './diff-checker.component.scss'
})
export class DiffCheckerComponent {
  readonly original = signal('');
  readonly modified = signal('');
  readonly ignoreWhitespace = signal(false);
  readonly diffs = signal<DiffLine[]>([]);
  private readonly clipboard = inject(ClipboardService);

  readonly stats = computed(() => {
    const lines = this.diffs();
    return {
      added: lines.filter(l => l.type === 'added').length,
      removed: lines.filter(l => l.type === 'removed').length,
      unchanged: lines.filter(l => l.type === 'unchanged').length,
    };
  });

  compare(): void {
    const oldText = this.original();
    const newText = this.modified();
    if (!oldText && !newText) return;

    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');

    if (this.ignoreWhitespace()) {
      const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
      const result = this.computeDiff(
        oldLines.map(normalize),
        newLines.map(normalize),
        oldLines,
        newLines
      );
      this.diffs.set(result);
    } else {
      this.diffs.set(this.computeDiff(oldLines, newLines, oldLines, newLines));
    }
  }

  private computeDiff(oldNorm: string[], newNorm: string[], oldOrig: string[], newOrig: string[]): DiffLine[] {
    const m = oldNorm.length;
    const n = newNorm.length;

    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (oldNorm[i - 1] === newNorm[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    const result: DiffLine[] = [];
    let i = m, j = n;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldNorm[i - 1] === newNorm[j - 1]) {
        result.unshift({
          type: 'unchanged',
          content: oldOrig[i - 1],
          oldLineNum: i,
          newLineNum: j,
        });
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({
          type: 'added',
          content: newOrig[j - 1],
          oldLineNum: null,
          newLineNum: j,
        });
        j--;
      } else {
        result.unshift({
          type: 'removed',
          content: oldOrig[i - 1],
          oldLineNum: i,
          newLineNum: null,
        });
        i--;
      }
    }

    return result;
  }

  loadSample(): void {
    this.original.set(`function saudacao(nome) {
  return "Olá, " + nome;
}

console.log(saudacao("Mundo"));`);

    this.modified.set(`function saudacao(nome, idioma = "pt") {
  const mensagens = { pt: "Olá", en: "Hello", es: "Hola" };
  return \`\${mensagens[idioma]}, \${nome}!\`;
}

console.log(saudacao("Mundo", "pt"));
console.log(saudacao("World", "en"));`);
    this.compare();
  }

  async copyDiff(): Promise<void> {
    const text = this.diffs().map(l => {
      const prefix = l.type === 'added' ? '+' : l.type === 'removed' ? '-' : ' ';
      return `${prefix} ${l.content}`;
    }).join('\n');
    await this.clipboard.copy(text);
  }

  clear(): void {
    this.original.set('');
    this.modified.set('');
    this.diffs.set([]);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      this.compare();
    }
  }
}
