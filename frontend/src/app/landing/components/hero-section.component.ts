import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  readonly particles = Array.from({ length: 30 }, (_, i) => ({
    x: 5 + i * 3,
    delay: i * 0.3,
    duration: 2 + i * 0.4
  }));
}
