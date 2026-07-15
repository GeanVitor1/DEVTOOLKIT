import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-diff-checker',
  imports: [FormsModule],
  templateUrl: './diff-checker.component.html',
  styleUrl: './diff-checker.component.scss'
})
export class DiffCheckerComponent {
  readonly left = signal('');
  readonly right = signal('');
  readonly output = signal<DiffLine[]>([]);

  compare(): void {
    const leftLines = this.left().split('\n');
    const rightLines = this.right().split('\n');
    const result: DiffLine[] = [];

    const maxLen = Math.max(leftLines.length, rightLines.length);
    for (let i = 0; i < maxLen; i++) {
      const left = leftLines[i] ?? '';
      const right = rightLines[i] ?? '';

      if (left === right) {
        if (left !== '') {
          result.push({ type: 'same', left, right, num: i + 1 });
        }
      } else {
        if (left !== '') {
          result.push({ type: 'removed', left, right: '', num: i + 1 });
        }
        if (right !== '') {
          result.push({ type: 'added', left: '', right, num: i + 1 });
        }
      }
    }

    this.output.set(result);
  }

  clear(): void {
    this.left.set('');
    this.right.set('');
    this.output.set([]);
  }
}

interface DiffLine {
  type: 'same' | 'added' | 'removed';
  left: string;
  right: string;
  num: number;
}
