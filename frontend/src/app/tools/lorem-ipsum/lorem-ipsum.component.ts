import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

@Component({
  selector: 'app-lorem-ipsum',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './lorem-ipsum.component.html',
  styleUrl: './lorem-ipsum.component.scss'
})
export class LoremIpsumComponent {
  readonly count = signal(3);
  readonly type = signal<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  readonly output = signal('');
  readonly startWithLorem = signal(true);

  private readonly loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur',
    'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui',
    'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
    'ultricies', 'leo', 'integer', 'malesuada', 'nunc', 'vel', 'risus', 'commodo',
    'viverra', 'maecenas', 'accumsan', 'lacus', 'vel', 'facilisis', 'volutpat',
    'est', 'velit', 'egestas', 'dui', 'ornare', 'arcu', 'odio', 'semper',
    'porttitor', 'rhoncus', 'purus', 'quam', 'nullam', 'porttitor', 'massa',
    'tellus', 'elementum', 'eu', 'facilisis', 'sed', 'odio', 'morbi', 'quis'
  ];

  generate(): void {
    const result: string[] = [];
    const count = this.count();

    if (this.type() === 'words') {
      const words = this.generateWords(count);
      result.push(this.capitalizeFirst(words.join(' ')));
    } else if (this.type() === 'sentences') {
      for (let i = 0; i < count; i++) {
        result.push(this.generateSentence());
      }
    } else {
      for (let i = 0; i < count; i++) {
        const sentences = 3 + Math.floor(Math.random() * 4);
        const para: string[] = [];
        for (let j = 0; j < sentences; j++) {
          para.push(this.generateSentence());
        }
        result.push(para.join(' '));
      }
    }

    this.output.set(result.join(this.type() === 'paragraphs' ? '\n\n' : ' '));
  }

  private generateWords(count: number): string[] {
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      words.push(this.loremWords[Math.floor(Math.random() * this.loremWords.length)]);
    }
    return words;
  }

  private generateSentence(): string {
    const len = 5 + Math.floor(Math.random() * 10);
    const words = this.generateWords(len);
    return this.capitalizeFirst(words.join(' ')) + '.';
  }

  private capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  increment(): void { this.count.set(Math.min(50, this.count() + 1)); this.generate(); }

  decrement(): void { this.count.set(Math.max(1, this.count() - 1)); this.generate(); }

  clear(): void {
    this.output.set('');
  }
}
