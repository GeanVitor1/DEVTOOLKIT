import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SafeHtmlPipe } from '../../shared/utils/safe-html.pipe';

interface ToolCard {
  icon: string;
  name: string;
  description: string;
  color: string;
  route: string;
  features: string[];
}

@Component({
  selector: 'app-tools-grid-section',
  imports: [RouterLink, SafeHtmlPipe],
  templateUrl: './tools-grid-section.component.html',
  styleUrl: './tools-grid-section.component.scss'
})
export class ToolsGridSectionComponent {
  readonly tools: ToolCard[] = [
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      name: 'HTTP Client',
      description: 'Interface nível Postman com tabs, headers, params, body, response e timeline.',
      color: 'var(--dtk-http)',
      route: '/tools/http-client',
      features: ['Métodos HTTP', 'Headers customizados', 'Response formatada']
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      name: 'JSON Formatter',
      description: 'Format, minify, valide e explore JSON com tree view interativa e JSONPath.',
      color: 'var(--dtk-json)',
      route: '/tools/json-formatter',
      features: ['Formatar/Minificar', 'Tree View', 'JSONPath']
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      name: 'JWT Decoder',
      description: 'Decodifique tokens JWT, visualize header, payload e signature com timer de expiração.',
      color: 'var(--dtk-jwt)',
      route: '/tools/jwt-decoder',
      features: ['Decodificar', 'Verificar', 'Timer']
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
      name: 'SQL Formatter',
      description: 'Formate SQL em 15 dialetos com configuração de upper/lower case e indentação.',
      color: 'var(--dtk-sql)',
      route: '/tools/sql-formatter',
      features: ['15 Dialetos', 'UPPER/lower', 'Indent config']
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/><path d="M11 8v6"/></svg>`,
      name: 'Regex Tester',
      description: 'Teste expressões regulares com highlight inline, grupos de captura e flags.',
      color: 'var(--dtk-regex)',
      route: '/tools/regex-tester',
      features: ['Highlight', 'Grupos', 'Flags']
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
      name: 'UUID Generator',
      description: 'Gere UUIDs v1/v4/v7 em múltiplos formatos com geração em lote.',
      color: 'var(--dtk-uuid)',
      route: '/tools/uuid-generator',
      features: ['v1/v4/v7', 'Formatos', 'Bulk']
    }
  ];
}
