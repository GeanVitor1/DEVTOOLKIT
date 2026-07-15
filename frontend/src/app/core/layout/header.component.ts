import { Component, inject, computed, signal, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { LayoutService } from '../services/layout.service';

interface ToolInfo {
  name: string;
  color: string;
  route: string;
  group: string;
}

const allTools: ToolInfo[] = [
  { name: 'HTTP Client', color: 'var(--dtk-http)', route: '/tools/http-client', group: 'Network' },
  { name: 'JWT Decoder', color: 'var(--dtk-jwt)', route: '/tools/jwt-decoder', group: 'Network' },
  { name: 'JWT Encoder', color: 'var(--dtk-jwt)', route: '/tools/jwt-encoder', group: 'Network' },
  { name: 'IP Calculator', color: 'var(--dtk-ip)', route: '/tools/ip-calculator', group: 'Network' },
  { name: 'WebSocket Tester', color: 'var(--dtk-ws)', route: '/tools/websocket-tester', group: 'Network' },
  { name: 'JSON Formatter', color: 'var(--dtk-json)', route: '/tools/json-formatter', group: 'Data' },
  { name: 'SQL Formatter', color: 'var(--dtk-sql)', route: '/tools/sql-formatter', group: 'Data' },
  { name: 'JSON to TypeScript', color: 'var(--dtk-json)', route: '/tools/json-to-ts', group: 'Data' },
  { name: 'YAML Formatter', color: 'var(--dtk-yaml)', route: '/tools/yaml-formatter', group: 'Data' },
  { name: 'Regex Tester', color: 'var(--dtk-regex)', route: '/tools/regex-tester', group: 'Utilities' },
  { name: 'UUID Generator', color: 'var(--dtk-uuid)', route: '/tools/uuid-generator', group: 'Utilities' },
  { name: 'Hash Generator', color: 'var(--dtk-hash)', route: '/tools/hash-generator', group: 'Utilities' },
  { name: 'Base64 Codec', color: 'var(--dtk-base64)', route: '/tools/base64-codec', group: 'Utilities' },
  { name: 'Markdown Preview', color: 'var(--dtk-markdown)', route: '/tools/markdown-preview', group: 'Utilities' },
  { name: 'URL Encoder', color: 'var(--dtk-url)', route: '/tools/url-codec', group: 'Utilities' },
  { name: 'Timestamp', color: 'var(--dtk-timestamp)', route: '/tools/timestamp-converter', group: 'Utilities' },
  { name: 'Color Converter', color: 'var(--dtk-color)', route: '/tools/color-converter', group: 'Utilities' },
  { name: 'Cron Builder', color: 'var(--dtk-cron)', route: '/tools/cron-builder', group: 'Utilities' },
  { name: 'Password Generator', color: 'var(--dtk-password)', route: '/tools/password-generator', group: 'Utilities' },
  { name: 'Diff Checker', color: 'var(--dtk-diff)', route: '/tools/diff-checker', group: 'Utilities' },
  { name: 'Docker Compose', color: 'var(--dtk-docker)', route: '/tools/docker-compose-gen', group: 'Utilities' },
];

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly theme = inject(ThemeService);
  readonly layout = inject(LayoutService);
  private readonly router = inject(Router);

  readonly searchOpen = signal(false);
  readonly searchQuery = signal('');
  readonly selectedIndex = signal(0);

  readonly filteredTools = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return allTools;
    return allTools.filter(t =>
      t.name.toLowerCase().includes(q) || t.group.toLowerCase().includes(q)
    );
  });

  readonly currentTool = computed(() => {
    const url = this.router.url;
    const match = url.match(/\/tools\/(\w+(-\w+)*)/);
    if (!match) return null;
    return allTools.find(t => t.route === `/tools/${match[1]}`) ?? null;
  });

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.toggleSearch();
    }
    if (e.key === 'Escape' && this.searchOpen()) {
      this.closeSearch();
    }
    if (this.searchOpen()) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex.update(i => Math.min(i + 1, this.filteredTools().length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex.update(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const tool = this.filteredTools()[this.selectedIndex()];
        if (tool) this.selectTool(tool);
      }
    }
  }

  toggleSearch(): void {
    this.searchOpen.update(v => !v);
    if (this.searchOpen()) {
      this.searchQuery.set('');
      this.selectedIndex.set(0);
    }
  }

  closeSearch(): void {
    this.searchOpen.set(false);
    this.searchQuery.set('');
  }

  selectTool(tool: ToolInfo): void {
    this.router.navigate([tool.route]);
    this.closeSearch();
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.selectedIndex.set(0);
  }
}
