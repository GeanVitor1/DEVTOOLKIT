import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  private intervals: ReturnType<typeof setInterval>[] = [];

  ngAfterViewInit(): void {
    const lines = [
      { id: 'decoder-line-1', text: 'Ferramentas que ' },
      { id: 'decoder-line-2', text: 'realmente entregam resultados' }
    ];
    const chars = '▓▒█☰#&!?$%^*€£@0123456789';
    const duration = 800;
    const hold = 30000;
    const step = 30;
    const steps = duration / step;

    lines.forEach((line, i) => {
      const el = document.getElementById(line.id);
      if (!el) return;

      const run = () => {
        let currentStep = 0;
        const interval = setInterval(() => {
          const progress = currentStep / steps;
          const revealed = Math.floor(progress * line.text.length);
          let result = '';
          for (let j = 0; j < line.text.length; j++) {
            if (line.text[j] === ' ') {
              result += ' ';
            } else if (j < revealed) {
              result += line.text[j];
            } else {
              result += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          el.textContent = result;
          currentStep++;
          if (currentStep > steps) {
            el.textContent = line.text;
            clearInterval(interval);
            setTimeout(run, hold);
          }
        }, step);
        this.intervals.push(interval);
      };

      setTimeout(run, i * 200);
    });
  }

  ngOnDestroy(): void {
    this.intervals.forEach(clearInterval);
  }
}
