import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

@Component({
  selector: 'app-string-utils',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './string-utils.component.html',
  styleUrl: './string-utils.component.scss'
})
export class StringUtilsComponent {
  readonly input = signal('');
  readonly charCount = signal(0);
  readonly wordCount = signal(0);
  readonly lineCount = signal(0);
  readonly byteSize = signal(0);
  readonly noSpaces = signal(0);
  readonly noSpacesNoLines = signal(0);
  readonly reversed = signal('');
  readonly invertedCase = signal('');
  readonly trimmed = signal('');

  analyze(): void {
    const text = this.input();
    this.charCount.set(text.length);
    this.wordCount.set(text.trim() ? text.trim().split(/\s+/).length : 0);
    this.lineCount.set(text ? text.split('\n').length : 0);
    this.byteSize.set(new TextEncoder().encode(text).length);
    this.noSpaces.set(text.replace(/\s/g, '').length);
    this.noSpacesNoLines.set(text.replace(/\s/g, '').replace(/\n/g, '').length);
    this.reversed.set(text.split('').reverse().join(''));
    this.invertedCase.set(this.invertCase(text));
    this.trimmed.set(text.trim());
  }

  private invertCase(text: string): string {
    return text.split('').map(c => {
      if (c === c.toUpperCase()) return c.toLowerCase();
      if (c === c.toLowerCase()) return c.toUpperCase();
      return c;
    }).join('');
  }

  clear(): void {
    this.input.set('');
    this.charCount.set(0);
    this.wordCount.set(0);
    this.lineCount.set(0);
    this.byteSize.set(0);
    this.noSpaces.set(0);
    this.noSpacesNoLines.set(0);
    this.reversed.set('');
    this.invertedCase.set('');
    this.trimmed.set('');
  }
}
