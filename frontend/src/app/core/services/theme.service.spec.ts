import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(ThemeService);
  });

  it('should default to dark theme', () => {
    expect(service.isDark()).toBe(true);
  });

  it('should toggle theme', () => {
    service.toggle();
    expect(service.isDark()).toBe(false);
    service.toggle();
    expect(service.isDark()).toBe(true);
  });

  it('should persist theme in localStorage', () => {
    service.toggle();
    expect(localStorage.getItem('dtk-theme')).toBe('light');
    service.toggle();
    expect(localStorage.getItem('dtk-theme')).toBe('dark');
  });
});
