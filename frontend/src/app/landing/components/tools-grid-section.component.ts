import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SafeHtmlPipe } from '../../shared/utils/safe-html.pipe';
import { TOOLS_CATALOG, TOOLS_COUNT } from '../../core/tools-catalog';

@Component({
  selector: 'app-tools-grid-section',
  imports: [RouterLink, SafeHtmlPipe],
  templateUrl: './tools-grid-section.component.html',
  styleUrl: './tools-grid-section.component.scss'
})
export class ToolsGridSectionComponent {
  readonly toolsCount = TOOLS_COUNT;
  readonly tools = TOOLS_CATALOG.map(t => ({
    icon: t.icon,
    name: t.name,
    description: t.description,
    color: t.color,
    route: t.route,
    group: t.group,
  }));
}
