import { Component } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section.component';
import { FeaturesSectionComponent } from './components/features-section.component';
import { ToolShowcaseComponent } from './components/tool-showcase.component';
import { FooterSectionComponent } from './components/footer-section.component';

@Component({
  selector: 'app-landing-page',
  imports: [HeroSectionComponent, FeaturesSectionComponent, ToolShowcaseComponent, FooterSectionComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {}
