import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';

@Component({
  selector: 'app-text-case',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './text-case.component.html',
  styleUrl: './text-case.component.scss'
})
export class TextCaseComponent {
  readonly input = signal('');
  readonly camelCase = signal('');
  readonly pascalCase = signal('');
  readonly snakeCase = signal('');
  readonly kebabCase = signal('');
  readonly upperCase = signal('');
  readonly lowerCase = signal('');
  readonly titleCase = signal('');
  readonly constantCase = signal('');
  readonly dotCase = signal('');

  convert(): void {
    const text = this.input();
    if (!text) {
      this.clear();
      return;
    }

    const words = this.extractWords(text);
    if (words.length === 0) {
      this.clear();
      return;
    }

    this.camelCase.set(this.toCamel(words));
    this.pascalCase.set(this.toPascal(words));
    this.snakeCase.set(this.toSnake(words));
    this.kebabCase.set(this.toKebab(words));
    this.upperCase.set(text.toUpperCase());
    this.lowerCase.set(text.toLowerCase());
    this.titleCase.set(words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '));
    this.constantCase.set(words.map(w => w.toUpperCase()).join('_'));
    this.dotCase.set(words.map(w => w.toLowerCase()).join('.'));
  }

  private extractWords(text: string): string[] {
    const cleaned = text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      .replace(/[^a-zA-Z0-9 ]/g, ' ');
    return cleaned.split(/\s+/).filter(w => w.length > 0);
  }

  private toCamel(words: string[]): string {
    return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  }

  private toPascal(words: string[]): string {
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  }

  private toSnake(words: string[]): string {
    return words.map(w => w.toLowerCase()).join('_');
  }

  private toKebab(words: string[]): string {
    return words.map(w => w.toLowerCase()).join('-');
  }

  private clear(): void {
    this.camelCase.set('');
    this.pascalCase.set('');
    this.snakeCase.set('');
    this.kebabCase.set('');
    this.upperCase.set('');
    this.lowerCase.set('');
    this.titleCase.set('');
    this.constantCase.set('');
    this.dotCase.set('');
  }
}
