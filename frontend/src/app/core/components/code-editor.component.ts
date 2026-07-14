import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.scss'
})
export class CodeEditorComponent {
  readonly code = model('');
  readonly language = input('text');
  readonly readonly = input(false);
  readonly height = input('200px');
  readonly placeholder = input('');
  readonly codeChange = output<string>();

  onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.code.set(value);
    this.codeChange.emit(value);
  }
}
