import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../services/layout.service';
import { ThemeService } from '../services/theme.service';
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
  readonly theme = inject(ThemeService);

  readonly groups: { label: string; items: SidebarItem[] }[] = [
    {
      label: 'Network',
      items: [
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
          label: 'HTTP Client',
          route: '/tools/http-client',
          color: 'var(--dtk-http)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
          label: 'JWT Decoder',
          route: '/tools/jwt-decoder',
          color: 'var(--dtk-jwt)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><line x1="12" y1="15" x2="12" y2="18"/></svg>`,
          label: 'JWT Encoder',
          route: '/tools/jwt-encoder',
          color: 'var(--dtk-jwt)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>`,
          label: 'IP Calculator',
          route: '/tools/ip-calculator',
          color: 'var(--dtk-ip)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
          label: 'WebSocket Tester',
          route: '/tools/websocket-tester',
          color: 'var(--dtk-ws)'
        },
      ]
    },
    {
      label: 'Data',
      items: [
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
          label: 'JSON Formatter',
          route: '/tools/json-formatter',
          color: 'var(--dtk-json)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
          label: 'SQL Formatter',
          route: '/tools/sql-formatter',
          color: 'var(--dtk-sql)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
          label: 'JSON to TypeScript',
          route: '/tools/json-to-ts',
          color: 'var(--dtk-json)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 9h10"/><path d="M7 13h6"/></svg>`,
          label: 'YAML Formatter',
          route: '/tools/yaml-formatter',
          color: 'var(--dtk-yaml)'
        },
      ]
    },
    {
      label: 'Utilities',
      items: [
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/><path d="M11 8v6"/></svg>`,
          label: 'Regex Tester',
          route: '/tools/regex-tester',
          color: 'var(--dtk-regex)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
          label: 'UUID Generator',
          route: '/tools/uuid-generator',
          color: 'var(--dtk-uuid)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3l-4 18"/><path d="M14 3l4 18"/></svg>`,
          label: 'Hash Generator',
          route: '/tools/hash-generator',
          color: 'var(--dtk-hash)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m16 13 3.4 3.4M18.6 16.4 15 13"/></svg>`,
          label: 'Base64 Codec',
          route: '/tools/base64-codec',
          color: 'var(--dtk-base64)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 15V9l3 4 3-4v6"/></svg>`,
          label: 'Markdown Preview',
          route: '/tools/markdown-preview',
          color: 'var(--dtk-markdown)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
          label: 'URL Encoder',
          route: '/tools/url-codec',
          color: 'var(--dtk-url)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
          label: 'Timestamp',
          route: '/tools/timestamp-converter',
          color: 'var(--dtk-timestamp)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
          label: 'Color Converter',
          route: '/tools/color-converter',
          color: 'var(--dtk-color)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
          label: 'Cron Builder',
          route: '/tools/cron-builder',
          color: 'var(--dtk-cron)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
          label: 'Password Generator',
          route: '/tools/password-generator',
          color: 'var(--dtk-password)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M3 12h4"/><path d="M21 12h-4"/></svg>`,
          label: 'Diff Checker',
          route: '/tools/diff-checker',
          color: 'var(--dtk-diff)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
          label: 'Docker Compose',
          route: '/tools/docker-compose-gen',
          color: 'var(--dtk-docker)'
        }
      ]
    }
  ];
}
