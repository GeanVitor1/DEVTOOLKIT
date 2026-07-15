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
      { path: 'hash-generator', loadComponent: () => import('./hash-generator/hash-generator.component').then(c => c.HashGeneratorComponent) },
      { path: 'base64-codec', loadComponent: () => import('./base64-codec/base64-codec.component').then(c => c.Base64CodecComponent) },
      { path: 'markdown-preview', loadComponent: () => import('./markdown-preview/markdown-preview.component').then(c => c.MarkdownPreviewComponent) },
      { path: 'url-codec', loadComponent: () => import('./url-codec/url-codec.component').then(c => c.UrlCodecComponent) },
      { path: 'timestamp-converter', loadComponent: () => import('./timestamp-converter/timestamp-converter.component').then(c => c.TimestampConverterComponent) },
      { path: 'color-converter', loadComponent: () => import('./color-converter/color-converter.component').then(c => c.ColorConverterComponent) },
      { path: 'cron-builder', loadComponent: () => import('./cron-builder/cron-builder.component').then(c => c.CronBuilderComponent) },
      { path: 'html-entities', loadComponent: () => import('./html-entities/html-entities.component').then(c => c.HtmlEntitiesComponent) },
      { path: 'json-yaml', loadComponent: () => import('./json-yaml/json-yaml.component').then(c => c.JsonYamlComponent) },
      { path: 'password-generator', loadComponent: () => import('./password-generator/password-generator.component').then(c => c.PasswordGeneratorComponent) },
      { path: 'number-base', loadComponent: () => import('./number-base/number-base.component').then(c => c.NumberBaseComponent) },
      { path: 'csv-json', loadComponent: () => import('./csv-json/csv-json.component').then(c => c.CsvJsonComponent) },
      { path: 'ip-cidr', loadComponent: () => import('./ip-cidr/ip-cidr.component').then(c => c.IpCidrComponent) },
      { path: 'text-case', loadComponent: () => import('./text-case/text-case.component').then(c => c.TextCaseComponent) },
      { path: 'xml-formatter', loadComponent: () => import('./xml-formatter/xml-formatter.component').then(c => c.XmlFormatterComponent) },
      { path: 'qr-code', loadComponent: () => import('./qr-code/qr-code.component').then(c => c.QrCodeComponent) },
      { path: 'diff-checker', loadComponent: () => import('./diff-checker/diff-checker.component').then(c => c.DiffCheckerComponent) },
      { path: 'string-utils', loadComponent: () => import('./string-utils/string-utils.component').then(c => c.StringUtilsComponent) },
      { path: 'lorem-ipsum', loadComponent: () => import('./lorem-ipsum/lorem-ipsum.component').then(c => c.LoremIpsumComponent) },
      { path: '', redirectTo: 'http-client', pathMatch: 'full' }
    ]
  }
];
