import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../services/layout.service';
import { SafeHtmlPipe } from '../../shared/utils/safe-html.pipe';

interface SidebarItem {
  icon: string;
  label: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, SafeHtmlPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  readonly layout = inject(LayoutService);

  readonly groups: { label: string; items: SidebarItem[] }[] = [
    {
      label: 'Rede',
      items: [
        {
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
          label: 'HTTP Client',
          route: '/tools/http-client',
          color: 'var(--dtk-http)'
        },
        {
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
          label: 'JWT Decoder',
          route: '/tools/jwt-decoder',
          color: 'var(--dtk-jwt)'
        },
      ]
    },
    {
      label: 'Dados',
      items: [
        {
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
          label: 'JSON Formatter',
          route: '/tools/json-formatter',
          color: 'var(--dtk-json)'
        },
        {
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
          label: 'SQL Formatter',
          route: '/tools/sql-formatter',
          color: 'var(--dtk-sql)'
        },
      ]
    },
    {
      label: 'Utilitários',
      items: [
        {
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/><path d="M11 8v6"/></svg>`,
          label: 'Regex Tester',
          route: '/tools/regex-tester',
          color: 'var(--dtk-regex)'
        },
        {
          icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
          label: 'UUID Generator',
          route: '/tools/uuid-generator',
          color: 'var(--dtk-uuid)'
        }
      ]
    }
  ];
}
