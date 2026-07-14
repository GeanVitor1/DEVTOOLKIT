import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

@Component({
  selector: 'app-timestamp-converter',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './timestamp-converter.component.html',
  styleUrl: './timestamp-converter.component.scss'
})
export class TimestampConverterComponent implements OnInit {
  readonly timestampInput = signal('');
  readonly dateInput = signal('');
  readonly results = signal<{ label: string; value: string }[]>([]);
  readonly now = signal('');
  readonly error = signal('');
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly clipboard = new ClipboardService();

  ngOnInit(): void {
    this.updateNow();
    this.intervalId = setInterval(() => this.updateNow(), 1000);
  }

  private updateNow(): void {
    const now = Math.floor(Date.now() / 1000);
    this.now.set(now.toString());
  }

  convertTimestamp(): void {
    const input = this.timestampInput().trim();
    if (!input) {
      this.results.set([]);
      this.error.set('');
      return;
    }

    let ts = parseInt(input, 10);
    if (isNaN(ts)) {
      this.error.set('Timestamp inválido');
      this.results.set([]);
      return;
    }

    if (ts > 9999999999) {
      // milliseconds
      ts = Math.floor(ts / 1000);
    }

    const date = new Date(ts * 1000);
    if (isNaN(date.getTime())) {
      this.error.set('Timestamp inválido');
      this.results.set([]);
      return;
    }

    this.error.set('');
    this.results.set([
      { label: 'ISO 8601', value: date.toISOString() },
      { label: 'UTC String', value: date.toUTCString() },
      { label: 'Local', value: date.toLocaleString('pt-BR') },
      { label: 'Date Only', value: date.toLocaleDateString('pt-BR') },
      { label: 'Time Only', value: date.toLocaleTimeString('pt-BR') },
      { label: 'Milliseconds', value: (ts * 1000).toString() },
    ]);
  }

  convertDate(): void {
    const input = this.dateInput().trim();
    if (!input) {
      this.results.set([]);
      this.error.set('');
      return;
    }

    const date = new Date(input);
    if (isNaN(date.getTime())) {
      this.error.set('Data inválida. Use formato: YYYY-MM-DD HH:mm:ss');
      this.results.set([]);
      return;
    }

    const ts = Math.floor(date.getTime() / 1000);
    this.error.set('');
    this.results.set([
      { label: 'Unix (s)', value: ts.toString() },
      { label: 'Unix (ms)', value: date.getTime().toString() },
      { label: 'ISO 8601', value: date.toISOString() },
      { label: 'UTC String', value: date.toUTCString() },
      { label: 'Local', value: date.toLocaleString('pt-BR') },
    ]);
  }

  useNow(): void {
    this.timestampInput.set(this.now());
    this.convertTimestamp();
  }

  async copyValue(value: string): Promise<void> {
    await this.clipboard.copy(value);
  }

  formatNowDate(): string {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
}
