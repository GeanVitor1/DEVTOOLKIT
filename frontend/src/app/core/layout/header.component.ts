import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { LayoutService } from '../services/layout.service';

const toolNames: Record<string, { name: string; color: string }> = {
  'http-client': { name: 'HTTP Client', color: 'var(--dtk-http)' },
  'json-formatter': { name: 'JSON Formatter', color: 'var(--dtk-json)' },
  'jwt-decoder': { name: 'JWT Decoder', color: 'var(--dtk-jwt)' },
  'sql-formatter': { name: 'SQL Formatter', color: 'var(--dtk-sql)' },
  'regex-tester': { name: 'Regex Tester', color: 'var(--dtk-regex)' },
  'uuid-generator': { name: 'UUID Generator', color: 'var(--dtk-uuid)' },
  'hash-generator': { name: 'Hash Generator', color: 'var(--dtk-hash)' },
  'base64-codec': { name: 'Base64 Codec', color: 'var(--dtk-base64)' },
  'markdown-preview': { name: 'Markdown Preview', color: 'var(--dtk-markdown)' },
  'url-codec': { name: 'URL Encoder', color: 'var(--dtk-url)' },
  'timestamp-converter': { name: 'Timestamp', color: 'var(--dtk-timestamp)' },
  'color-converter': { name: 'Color Converter', color: 'var(--dtk-color)' },
  'cron-builder': { name: 'Cron Builder', color: 'var(--dtk-cron)' },
};

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

  readonly currentTool = computed(() => {
    const url = this.router.url;
    const match = url.match(/\/tools\/(\w+(-\w+)*)/);
    if (!match) return null;
    return toolNames[match[1]] ?? null;
  });
}
