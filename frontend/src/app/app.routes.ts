import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/landing-page.component').then(c => c.LandingPageComponent)
  },
  {
    path: 'tools',
    loadChildren: () => import('./tools/tools.routes').then(r => r.toolRoutes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
