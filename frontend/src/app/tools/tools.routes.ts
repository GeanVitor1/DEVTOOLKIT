import { Routes } from '@angular/router';
import { ToolLayoutComponent } from '../core/layout/tool-layout.component';

export const toolRoutes: Routes = [
  {
    path: '',
    component: ToolLayoutComponent,
    children: [
      { path: 'http-client', loadComponent: () => import('./http-client/http-client.component').then(c => c.HttpClientComponent) },
      { path: 'json-formatter', loadComponent: () => import('./json-formatter/json-formatter.component').then(c => c.JsonFormatterComponent) },
      { path: 'jwt-decoder', loadComponent: () => import('./jwt-decoder/jwt-decoder.component').then(c => c.JwtDecoderComponent) },
      { path: 'sql-formatter', loadComponent: () => import('./sql-formatter/sql-formatter.component').then(c => c.SqlFormatterComponent) },
      { path: 'regex-tester', loadComponent: () => import('./regex-tester/regex-tester.component').then(c => c.RegexTesterComponent) },
      { path: 'uuid-generator', loadComponent: () => import('./uuid-generator/uuid-generator.component').then(c => c.UuidGeneratorComponent) },
      { path: '', redirectTo: 'http-client', pathMatch: 'full' }
    ]
  }
];
