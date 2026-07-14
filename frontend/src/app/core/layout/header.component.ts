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
