import { Component } from '@angular/core';
import { SafeHtmlPipe } from '../../shared/utils/safe-html.pipe';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-features-section',
  imports: [SafeHtmlPipe],
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.scss'
})
export class FeaturesSectionComponent {
  readonly features: Feature[] = [
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      title: '100% Client-side',
      description: 'Seus dados nunca saem do navegador. Tudo processado localmente com privacidade total.',
      color: 'var(--dtk-info)'
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
      title: 'Interface Premium',
      description: 'Design moderno com tema escuro, animações suaves e experiência comparável a softwares comerciais.',
      color: 'var(--dtk-json)'
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M2 10h20"/></svg>`,
      title: 'Responsivo',
      description: 'Funciona perfeitamente em desktop, tablet e mobile. Ferramentas adaptativas em qualquer tela.',
      color: 'var(--dtk-http)'
    },
    {
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
      title: 'Ferramentas Completas',
      description: 'Cada ferramenta foi pensada para substituir múltiplos sites e aplicativos no seu dia a dia.',
      color: 'var(--dtk-sql)'
    }
  ];
}
