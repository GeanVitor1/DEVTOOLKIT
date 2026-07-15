import { Component, AfterViewInit, OnDestroy, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOOLS_COUNT } from '../../core/tools-catalog';

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  readonly toolsCount = TOOLS_COUNT;
  private readonly host = inject(ElementRef<HTMLElement>);
  private timers: ReturnType<typeof setTimeout>[] = [];
  private destroyed = false;

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.setFinalText();
      return;
    }

    const lines = [
      { id: 'decoder-line-1', text: 'Ferramentas que ' },
      { id: 'decoder-line-2', text: 'realmente entregam resultados' }
    ];

    // Staggered start, then decode once. No infinite re-loop (that was stacking timers).
    lines.forEach((line, i) => {
      const el = this.queryLine(line.id);
      if (!el) return;
      el.textContent = this.scramble(line.text);
      this.schedule(() => this.decodeLine(el, line.text), 180 + i * 220);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  private setFinalText(): void {
    const map: Record<string, string> = {
      'decoder-line-1': 'Ferramentas que ',
      'decoder-line-2': 'realmente entregam resultados'
    };
    for (const [id, text] of Object.entries(map)) {
      const el = this.queryLine(id);
      if (el) el.textContent = text;
    }
  }

  private queryLine(id: string): HTMLElement | null {
    return this.host.nativeElement.querySelector(`#${id}`) as HTMLElement | null;
  }

  private decodeLine(el: HTMLElement, text: string): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@$%&*';
    const totalSteps = Math.max(18, text.replace(/\s/g, '').length + 8);
    let step = 0;

    const tick = () => {
      if (this.destroyed) return;

      step++;
      const progress = Math.min(1, step / totalSteps);
      // Reveal left-to-right with a soft ease so it doesn't "jump"
      const revealed = Math.floor(this.easeOutCubic(progress) * text.length);

      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          out += ' ';
        } else if (i < revealed) {
          out += text[i];
        } else {
          out += chars[(Math.random() * chars.length) | 0];
        }
      }
      el.textContent = out;

      if (step < totalSteps) {
        // Slightly faster near the end for a snappy settle
        const delay = progress > 0.75 ? 28 : 36;
        this.schedule(tick, delay);
      } else {
        el.textContent = text;
        el.classList.add('decoded');
      }
    };

    tick();
  }

  private scramble(text: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@$%&*';
    return text
      .split('')
      .map(c => (c === ' ' ? ' ' : chars[(Math.random() * chars.length) | 0]))
      .join('');
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  private schedule(fn: () => void, ms: number): void {
    const id = setTimeout(() => {
      this.timers = this.timers.filter(t => t !== id);
      fn();
    }, ms);
    this.timers.push(id);
  }
}
