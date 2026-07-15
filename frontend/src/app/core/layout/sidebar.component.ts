import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '../services/layout.service';
import { ThemeService } from '../services/theme.service';
import { SafeHtmlPipe } from '../../shared/utils/safe-html.pipe';
import { toolsByGroup, searchTools, TOOLS_COUNT } from '../tools-catalog';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, SafeHtmlPipe, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  readonly layout = inject(LayoutService);
  readonly theme = inject(ThemeService);
  readonly filter = signal('');
  readonly toolsCount = TOOLS_COUNT;

  readonly groups = computed(() => {
    const q = this.filter().trim();
    if (!q) return toolsByGroup();

    const matched = searchTools(q);
    const byGroup = new Map<string, typeof matched>();
    for (const tool of matched) {
      const list = byGroup.get(tool.group) ?? [];
      list.push(tool);
      byGroup.set(tool.group, list);
    }
    return Array.from(byGroup.entries()).map(([label, items]) => ({ label, items }));
  });

  onFilter(value: string): void {
    this.filter.set(value);
  }
}
