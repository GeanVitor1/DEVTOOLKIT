import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  readonly icon = input('');
  readonly title = input('');
  readonly description = input('');
  readonly actionLabel = input('');
  readonly action = output<void>();
}
