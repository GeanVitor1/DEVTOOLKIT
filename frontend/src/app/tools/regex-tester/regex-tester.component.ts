import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CopyButtonComponent } from '../../core/components/copy-button.component';


interface RegexMatch {
  index: number;
  full: string;
  groups: (string | undefined)[];
}

type FlagKey = 'g' | 'i' | 'm' | 's' | 'u';

@Component({
  selector: 'app-regex-tester',
  imports: [FormsModule, CopyButtonComponent],
  templateUrl: './regex-tester.component.html',
  styleUrl: './regex-tester.component.scss'
})
export class RegexTesterComponent {
  readonly pattern = signal('(\\w+)@(\\w+)\\.(\\w+)');
  readonly flags = signal<Record<FlagKey, boolean>>({ g: true, i: false, m: false, s: false, u: false });
  readonly testString = signal('Contact: john@email.com and support@test.com');

  private readonly sanitizer = inject(DomSanitizer);

  readonly flagKeys: { key: FlagKey; label: string }[] = [
    { key: 'g', label: 'g' },
    { key: 'i', label: 'i' },
    { key: 'm', label: 'm' },
    { key: 's', label: 's' },
    { key: 'u', label: 'u' },
  ];

  readonly flagString = computed(() => {
    const f = this.flags();
    return this.flagKeys.filter(k => f[k.key]).map(k => k.key).join('');
  });

  readonly regex = computed(() => {
    try {
      return new RegExp(this.pattern(), this.flagString());
    } catch {
      return null;
    }
  });

  readonly matches = computed<RegexMatch[]>(() => {
    const re = this.regex();
    const text = this.testString();
    if (!re || !text) return [];

    const results: RegexMatch[] = [];
    let match: RegExpExecArray | null;

    if (re.flags.includes('g')) {
      re.lastIndex = 0;
      while ((match = re.exec(text)) !== null) {
        results.push({
          index: match.index,
          full: match[0],
          groups: Array.from(match).slice(1),
        });
        if (match.index === re.lastIndex) re.lastIndex++;
      }
    } else {
      match = re.exec(text);
      if (match) {
        results.push({
          index: match.index,
          full: match[0],
          groups: Array.from(match).slice(1),
        });
      }
    }

    return results;
  });

  readonly matchCount = computed(() => this.matches().length);

  readonly highlightedHtml = computed<SafeHtml | null>(() => {
    const re = this.regex();
    const text = this.testString();
    if (!re || !text) return null;

    try {
      const globalRe = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
      const html = text.replace(globalRe, '<mark class="regex-highlight">$&</mark>');
      return this.sanitizer.bypassSecurityTrustHtml(html);
    } catch {
      return null;
    }
  });

  readonly error = computed(() => {
    try {
      new RegExp(this.pattern(), this.flagString());
      return null;
    } catch (e) {
      return (e as Error).message;
    }
  });

  readonly isValid = computed(() => this.error() === null);

  toggleFlag(key: FlagKey): void {
    this.flags.update(f => ({ ...f, [key]: !f[key] }));
  }

  setExample(): void {
    this.pattern.set('(\\w+)@(\\w+)\\.(\\w+)');
    this.flags.set({ g: true, i: false, m: false, s: false, u: false });
    this.testString.set('Contact: john@email.com and support@test.com');
  }

  clear(): void {
    this.pattern.set('');
    this.testString.set('');
  }
}
