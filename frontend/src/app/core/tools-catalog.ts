export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  route: string;
  group: 'Network' | 'Data' | 'Encode' | 'Text' | 'DevOps' | 'Reference';
  color: string;
  icon: string;
  keywords?: string[];
}

const I = {
  globe: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  lock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  lockKey: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><line x1="12" y1="15" x2="12" y2="18"/></svg>`,
  ip: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>`,
  zap: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  code: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  db: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  yaml: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 9h10"/><path d="M7 13h6"/></svg>`,
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/><path d="M11 8v6"/></svg>`,
  link: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  hash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3l-4 18"/><path d="M14 3l4 18"/></svg>`,
  file: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  md: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 15V9l3 4 3-4v6"/></svg>`,
  clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  palette: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  diff: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M3 12h4"/><path d="M21 12h-4"/></svg>`,
  docker: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  type: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  text: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>`,
  binary: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  entities: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h10"/><path d="M4 17h14"/><path d="M18 10l2 2-2 2"/></svg>`,
  lorem: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
  qr: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><path d="M21 14h-3v3"/><path d="M14 21h3v-3"/></svg>`,
  shield: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  env: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M8 8h8"/><path d="M8 12h5"/><path d="M8 16h6"/></svg>`,
  status: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
  parse: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/><circle cx="12" cy="12" r="2"/></svg>`,
  folder: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2"/></svg>`,
};

export const TOOLS_CATALOG: ToolMeta[] = [
  // Network
  { id: 'http-client', name: 'HTTP Client', description: 'Cliente HTTP com headers, body e response', route: '/tools/http-client', group: 'Network', color: 'var(--dtk-http)', icon: I.globe, keywords: ['api', 'rest', 'request', 'postman'] },
  { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decodifique e inspecione tokens JWT', route: '/tools/jwt-decoder', group: 'Network', color: 'var(--dtk-jwt)', icon: I.lock, keywords: ['token', 'auth', 'bearer'] },
  { id: 'jwt-encoder', name: 'JWT Encoder', description: 'Monte e assine tokens JWT (HS*)', route: '/tools/jwt-encoder', group: 'Network', color: 'var(--dtk-jwt)', icon: I.lockKey, keywords: ['token', 'sign', 'hs256'] },
  { id: 'ip-calculator', name: 'IP Calculator', description: 'Sub-rede, máscara e hosts CIDR', route: '/tools/ip-calculator', group: 'Network', color: 'var(--dtk-ip)', icon: I.ip, keywords: ['cidr', 'subnet', 'network'] },
  { id: 'websocket-tester', name: 'WebSocket Tester', description: 'Conecte e teste sockets em tempo real', route: '/tools/websocket-tester', group: 'Network', color: 'var(--dtk-ws)', icon: I.zap, keywords: ['ws', 'socket', 'realtime'] },
  { id: 'url-parser', name: 'URL Parser', description: 'Decomponha URL, query e fragmentos', route: '/tools/url-parser', group: 'Network', color: 'var(--dtk-url)', icon: I.parse, keywords: ['query', 'params', 'uri'] },

  // Data
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Format, minify e explore JSON', route: '/tools/json-formatter', group: 'Data', color: 'var(--dtk-json)', icon: I.code, keywords: ['format', 'pretty', 'validate'] },
  { id: 'sql-formatter', name: 'SQL Formatter', description: 'Formate SQL em vários dialetos', route: '/tools/sql-formatter', group: 'Data', color: 'var(--dtk-sql)', icon: I.db, keywords: ['query', 'mysql', 'postgres'] },
  { id: 'json-to-ts', name: 'JSON to TypeScript', description: 'Gere interfaces TypeScript a partir de JSON', route: '/tools/json-to-ts', group: 'Data', color: 'var(--dtk-json)', icon: I.code, keywords: ['typescript', 'interface', 'types'] },
  { id: 'yaml-formatter', name: 'YAML Formatter', description: 'Valide e formate documentos YAML', route: '/tools/yaml-formatter', group: 'Data', color: 'var(--dtk-yaml)', icon: I.yaml, keywords: ['yml', 'k8s', 'config'] },
  { id: 'json-yaml', name: 'JSON ↔ YAML', description: 'Converta entre JSON e YAML', route: '/tools/json-yaml', group: 'Data', color: 'var(--dtk-yaml)', icon: I.yaml, keywords: ['convert', 'yml'] },
  { id: 'xml-formatter', name: 'XML Formatter', description: 'Formate e minifique XML', route: '/tools/xml-formatter', group: 'Data', color: 'var(--dtk-xml)', icon: I.file, keywords: ['soap', 'markup'] },
  { id: 'csv-json', name: 'CSV ↔ JSON', description: 'Converta planilhas CSV para JSON', route: '/tools/csv-json', group: 'Data', color: 'var(--dtk-csv)', icon: I.file, keywords: ['excel', 'table', 'spreadsheet'] },
  { id: 'env-parser', name: 'Env Parser', description: 'Parse, valide e edite arquivos .env', route: '/tools/env-parser', group: 'Data', color: 'var(--dtk-env)', icon: I.env, keywords: ['dotenv', 'environment', 'config'] },

  // Encode
  { id: 'base64-codec', name: 'Base64 Codec', description: 'Encode e decode Base64', route: '/tools/base64-codec', group: 'Encode', color: 'var(--dtk-base64)', icon: I.folder, keywords: ['encode', 'decode'] },
  { id: 'url-codec', name: 'URL Encoder', description: 'Encode e decode componentes de URL', route: '/tools/url-codec', group: 'Encode', color: 'var(--dtk-url)', icon: I.link, keywords: ['percent', 'uri', 'encode'] },
  { id: 'hash-generator', name: 'Hash Generator', description: 'SHA-1, SHA-256 e SHA-512', route: '/tools/hash-generator', group: 'Encode', color: 'var(--dtk-hash)', icon: I.hash, keywords: ['sha', 'checksum', 'digest'] },
  { id: 'html-entities', name: 'HTML Entities', description: 'Escape e unescape entidades HTML', route: '/tools/html-entities', group: 'Encode', color: 'var(--dtk-html)', icon: I.entities, keywords: ['escape', 'amp', 'xss'] },
  { id: 'number-base', name: 'Number Base', description: 'BIN, OCT, DEC e HEX', route: '/tools/number-base', group: 'Encode', color: 'var(--dtk-num)', icon: I.binary, keywords: ['binary', 'hex', 'octal'] },

  // Text
  { id: 'regex-tester', name: 'Regex Tester', description: 'Teste regex com grupos e flags', route: '/tools/regex-tester', group: 'Text', color: 'var(--dtk-regex)', icon: I.search, keywords: ['regexp', 'pattern', 'match'] },
  { id: 'text-case', name: 'Text Case', description: 'camelCase, snake_case, kebab-case...', route: '/tools/text-case', group: 'Text', color: 'var(--dtk-text)', icon: I.type, keywords: ['case', 'camel', 'snake', 'kebab'] },
  { id: 'string-utils', name: 'String Utils', description: 'Contagem, reverse e análise de texto', route: '/tools/string-utils', group: 'Text', color: 'var(--dtk-text)', icon: I.text, keywords: ['count', 'words', 'bytes'] },
  { id: 'markdown-preview', name: 'Markdown Preview', description: 'Preview ao vivo de Markdown', route: '/tools/markdown-preview', group: 'Text', color: 'var(--dtk-markdown)', icon: I.md, keywords: ['md', 'preview', 'readme'] },
  { id: 'diff-checker', name: 'Diff Checker', description: 'Compare dois textos lado a lado', route: '/tools/diff-checker', group: 'Text', color: 'var(--dtk-diff)', icon: I.diff, keywords: ['compare', 'diff', 'git'] },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum', description: 'Gere texto placeholder', route: '/tools/lorem-ipsum', group: 'Text', color: 'var(--dtk-lorem)', icon: I.lorem, keywords: ['placeholder', 'dummy', 'filler'] },

  // DevOps
  { id: 'uuid-generator', name: 'UUID Generator', description: 'UUIDs v4 e geração em lote', route: '/tools/uuid-generator', group: 'DevOps', color: 'var(--dtk-uuid)', icon: I.link, keywords: ['guid', 'id', 'nanoid'] },
  { id: 'password-generator', name: 'Password Generator', description: 'Senhas fortes e configuráveis', route: '/tools/password-generator', group: 'DevOps', color: 'var(--dtk-password)', icon: I.shield, keywords: ['secret', 'secure', 'random'] },
  { id: 'timestamp-converter', name: 'Timestamp', description: 'Unix epoch ↔ data legível', route: '/tools/timestamp-converter', group: 'DevOps', color: 'var(--dtk-timestamp)', icon: I.clock, keywords: ['epoch', 'unix', 'date'] },
  { id: 'cron-builder', name: 'Cron Builder', description: 'Monte expressões cron com preview', route: '/tools/cron-builder', group: 'DevOps', color: 'var(--dtk-cron)', icon: I.clock, keywords: ['schedule', 'crontab', 'job'] },
  { id: 'docker-compose-gen', name: 'Docker Compose', description: 'Gere docker-compose.yml', route: '/tools/docker-compose-gen', group: 'DevOps', color: 'var(--dtk-docker)', icon: I.docker, keywords: ['compose', 'container', 'yml'] },
  { id: 'chmod-calculator', name: 'Chmod Calculator', description: 'Permissões Unix em octal e simbólico', route: '/tools/chmod-calculator', group: 'DevOps', color: 'var(--dtk-chmod)', icon: I.shield, keywords: ['permissions', 'unix', 'rwx', 'linux'] },
  { id: 'qr-code', name: 'QR Code', description: 'Gere QR codes a partir de texto/URL', route: '/tools/qr-code', group: 'DevOps', color: 'var(--dtk-qr)', icon: I.qr, keywords: ['qrcode', 'barcode'] },
  { id: 'color-converter', name: 'Color Converter', description: 'HEX, RGB, HSL e preview', route: '/tools/color-converter', group: 'DevOps', color: 'var(--dtk-color)', icon: I.palette, keywords: ['hex', 'rgb', 'hsl', 'css'] },

  // Reference
  { id: 'http-status', name: 'HTTP Status Codes', description: 'Referência rápida de status HTTP', route: '/tools/http-status', group: 'Reference', color: 'var(--dtk-status)', icon: I.status, keywords: ['404', '500', 'status', 'codes'] },
];

export const TOOL_GROUPS = ['Network', 'Data', 'Encode', 'Text', 'DevOps', 'Reference'] as const;

export function getToolById(id: string): ToolMeta | undefined {
  return TOOLS_CATALOG.find(t => t.id === id);
}

export function getToolByRoute(route: string): ToolMeta | undefined {
  return TOOLS_CATALOG.find(t => t.route === route || t.route === `/tools/${route}` || t.id === route);
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS_CATALOG;
  return TOOLS_CATALOG.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.group.toLowerCase().includes(q) ||
    t.id.includes(q) ||
    (t.keywords?.some(k => k.includes(q)) ?? false)
  );
}

export function toolsByGroup(): { label: string; items: ToolMeta[] }[] {
  return TOOL_GROUPS
    .map(label => ({
      label,
      items: TOOLS_CATALOG.filter(t => t.group === label)
    }))
    .filter(g => g.items.length > 0);
}

export const TOOLS_COUNT = TOOLS_CATALOG.length;
