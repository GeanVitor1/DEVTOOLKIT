import { Component, inject, computed, signal, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { LayoutService } from '../services/layout.service';
import { searchTools, getToolById } from '../tools-catalog';

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

  readonly filteredTools = computed(() => searchTools(this.searchQuery()));

  readonly currentTool = computed(() => {
    const url = this.router.url;
    const match = url.match(/\/tools\/([\w-]+)/);
    if (!match) return null;
    return getToolById(match[1]) ?? null;
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
        if (tool) this.selectTool(tool.route);
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

  selectTool(route: string): void {
    this.router.navigateByUrl(route);
    this.closeSearch();
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.selectedIndex.set(0);
  }
}
