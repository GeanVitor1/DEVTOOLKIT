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
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
          label: 'HTML Entities',
          route: '/tools/html-entities',
          color: 'var(--dtk-html)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
          label: 'JSON ↔ YAML',
          route: '/tools/json-yaml',
          color: 'var(--dtk-yaml)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
          label: 'Password Gen',
          route: '/tools/password-generator',
          color: 'var(--dtk-password)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
          label: 'Number Base',
          route: '/tools/number-base',
          color: 'var(--dtk-num-base)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
          label: 'CSV ↔ JSON',
          route: '/tools/csv-json',
          color: 'var(--dtk-csv)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
          label: 'IP/CIDR',
          route: '/tools/ip-cidr',
          color: 'var(--dtk-ip)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
          label: 'Text Case',
          route: '/tools/text-case',
          color: 'var(--dtk-text-case)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
          label: 'XML Formatter',
          route: '/tools/xml-formatter',
          color: 'var(--dtk-xml)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="4" height="4"/><rect x="7" y="17" width="3" height="3"/></svg>`,
          label: 'QR Code',
          route: '/tools/qr-code',
          color: 'var(--dtk-qr)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
          label: 'Diff Checker',
          route: '/tools/diff-checker',
          color: 'var(--dtk-diff)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
          label: 'String Utils',
          route: '/tools/string-utils',
          color: 'var(--dtk-string)'
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="12" y1="12" x2="12" y2="20"/></svg>`,
          label: 'Lorem Ipsum',
          route: '/tools/lorem-ipsum',
          color: 'var(--dtk-lorem)'
        }
      ]
    }
  ];
}
