import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyButtonComponent } from '../../core/components/copy-button.component';
import { ClipboardService } from '../../core/services/clipboard.service';

interface CronField {
  label: string;
  value: string;
  options: string[];
}

@Component({
  selector: 'app-cron-builder',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './cron-builder.component.html',
  styleUrl: './cron-builder.component.scss'
})
export class CronBuilderComponent {
  readonly fields = signal<CronField[]>([
    { label: 'Minuto', value: '0', options: this.generateRange(0, 59) },
    { label: 'Hora', value: '0', options: this.generateRange(0, 23) },
    { label: 'Dia', value: '*', options: ['*', ...this.generateRange(1, 31)] },
    { label: 'Mês', value: '*', options: ['*', ...this.generateRange(1, 12)] },
    { label: 'Dia da Semana', value: '*', options: ['*', '0', '1', '2', '3', '4', '5', '6'] },
  ]);

  readonly expression = computed(() => {
    return this.fields().map(f => f.value).join(' ');
  });

  readonly description = computed(() => {
    const [min, hour, day, month, dow] = this.fields().map(f => f.value);
    const parts: string[] = [];

    if (min === '*' && hour === '*') {
      parts.push('A cada minuto');
    } else if (min === '0' && hour === '*') {
      parts.push('A cada hora, no minuto 0');
    } else if (min !== '*' && hour !== '*') {
      parts.push(`Às ${hour.padStart(2, '0')}:${min.padStart(2, '0')}`);
    } else if (min !== '*') {
      parts.push(`No minuto ${min}`);
    } else {
      parts.push(`À hora ${hour}`);
    }

    if (day !== '*') parts.push(`no dia ${day}`);
    if (month !== '*') parts.push(`do mês ${month}`);
    if (dow !== '*') {
      const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      parts.push(`(${days[parseInt(dow)]})`);
    }

    return parts.join(' ');
  });

  readonly presets = signal([
    { label: 'A cada minuto', value: '* * * * *' },
    { label: 'A cada 5 min', value: '*/5 * * * *' },
    { label: 'A cada hora', value: '0 * * * *' },
    { label: 'Todo dia às 9h', value: '0 9 * * *' },
    { label: 'Seg-Sex às 9h', value: '0 9 * * 1-5' },
    { label: 'Todo domingo', value: '0 0 * * 0' },
    { label: 'Todo dia meia-noite', value: '0 0 * * *' },
    { label: 'A cada 15 min', value: '*/15 * * * *' },
  ]);

  private readonly clipboard = new ClipboardService();

  private generateRange(start: number, end: number): string[] {
    return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString());
  }

  setField(index: number, value: string): void {
    const updated = [...this.fields()];
    updated[index] = { ...updated[index], value };
    this.fields.set(updated);
  }

  applyPreset(cron: string): void {
    const parts = cron.split(' ');
    if (parts.length === 5) {
      this.fields.set(this.fields().map((f, i) => ({ ...f, value: parts[i] })));
    }
  }

  async copyExpression(): Promise<void> {
    await this.clipboard.copy(this.expression());
  }

  getDowLabel(value: string): string {
    const labels: Record<string, string> = {
      '*': '*',
      '0': 'Dom',
      '1': 'Seg',
      '2': 'Ter',
      '3': 'Qua',
      '4': 'Qui',
      '5': 'Sex',
      '6': 'Sáb',
    };
    return labels[value] ?? value;
  }
}
