import { Component, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SafeHtmlPipe } from '../../shared/utils/safe-html.pipe';
import gsap from 'gsap';

interface ShowcaseTool {
  icon: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  route: string;
  features: string[];
  preview: string;
}

@Component({
  selector: 'app-tool-showcase',
  imports: [RouterLink, SafeHtmlPipe],
  templateUrl: './tool-showcase.component.html',
  styleUrl: './tool-showcase.component.scss'
})
export class ToolShowcaseComponent {
  readonly tools: ShowcaseTool[] = [
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      name: 'HTML Entities Codec',
      tagline: 'Codifique e decodifique caracteres HTML',
      description: 'Converta caracteres especiais como &, <, >, " e \' em HTML entities seguras e vice-versa. Essencial para evitar XSS e exibir HTML corretamente.',
      color: 'var(--dtk-html)',
      route: '/tools/html-entities',
      features: ['Encode HTML entities', 'Decode HTML entities', 'Suporte a &amp; &lt; &gt;', 'Troca rápida modo'],
      preview: `<div class="preview-regex">
  <div class="preview-regex-pattern" style="color: var(--dtk-html);font-size:11px">
    &amp;lt;script&amp;gt;alert('xss')&amp;lt;/script&amp;gt;
  </div>
  <div class="preview-line dim spacer"></div>
  <div class="preview-line">&lt;script&gt;alert('xss')&lt;/script&gt;</div>
  <div class="preview-line dim">6 caracteres codificados</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      name: 'JSON ↔ YAML Converter',
      tagline: 'Converta entre JSON e YAML instantaneamente',
      description: 'Transforme arquivos JSON em YAML e vice-versa. Preserva a estrutura de dados aninhados, arrays e tipos primitivos.',
      color: 'var(--dtk-yaml)',
      route: '/tools/json-yaml',
      features: ['JSON para YAML', 'YAML para JSON', 'Preserva tipos', 'Cópia rápida'],
      preview: `<div class="preview-regex">
  <div class="preview-line"><span class="json-key" style="color: var(--dtk-yaml)">name</span>: DevToolkit</div>
  <div class="preview-line" style="color:var(--dtk-yaml)">version: 1.0</div>
  <div class="preview-line dim spacer"></div>
  <div class="preview-line"><span class="json-bracket">{</span> <span class="json-key">"name"</span>: <span class="json-str">"DevToolkit"</span> <span class="json-bracket">}</span></div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      name: 'Password Generator',
      tagline: 'Senhas fortes em um clique',
      description: 'Gere senhas seguras com comprimento ajustável e seleção de tipos de caracteres: maiúsculas, minúsculas, números e símbolos. Força da senha em tempo real.',
      color: 'var(--dtk-password)',
      route: '/tools/password-generator',
      features: ['4 tipos caracteres', 'Slider 4-64 chars', 'Força da senha', 'crypto.getRandomValues'],
      preview: `<div class="preview-regex">
  <div class="preview-regex-pattern" style="font-family:mono;font-size:13px;color:var(--dtk-password)">xK8#mP2$vL9*qR5!</div>
  <div class="preview-line dim spacer"></div>
  <div class="preview-line"><span class="json-valid">&check; Muito Forte</span> <span class="dim">—</span> 16 caracteres</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
      name: 'Number Base Converter',
      tagline: 'Converta entre binário, octal, decimal e hexadecimal',
      description: 'Conversão instantânea entre as 4 bases numéricas mais usadas na computação. Suporte a valores grandes e formatação clara.',
      color: 'var(--dtk-num-base)',
      route: '/tools/number-base',
      features: ['Binário (base 2)', 'Octal (base 8)', 'Decimal (base 10)', 'Hexadecimal (base 16)'],
      preview: `<div class="preview-regex">
  <div class="preview-line"><span class="json-key" style="color:var(--dtk-num-base)">255</span> decimal =</div>
  <div class="preview-line dim">11111111 bin</div>
  <div class="preview-line dim">377 oct</div>
  <div class="preview-line dim">FF hex</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
      name: 'CSV ↔ JSON Converter',
      tagline: 'Converta dados entre CSV e JSON',
      description: 'Transforme planilhas CSV em objetos JSON e vice-versa. Suporte a múltiplos delimitadores (vírgula, ponto e vírgula, tab, pipe) e valores com aspas.',
      color: 'var(--dtk-csv)',
      route: '/tools/csv-json',
      features: ['CSV → JSON', 'JSON → CSV', 'Múltiplos delimitadores', 'Valores com aspas'],
      preview: `<div class="preview-regex">
  <div class="preview-line"><span class="json-key" style="color:var(--dtk-csv)">name</span>,<span class="json-key">email</span></div>
  <div class="preview-line dim">John,john@test.com</div>
  <div class="preview-line dim spacer"></div>
  <div class="preview-line dim">→ [{ "name": "John", "email": "john@test.com" }]</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
      name: 'IP/CIDR Calculator',
      tagline: 'Calcule redes e sub-redes IP',
      description: 'Informações completas de qualquer bloco CIDR: endereço de rede, máscara, broadcast, range de hosts, classe e muito mais. Essencial para DevOps e infraestrutura.',
      color: 'var(--dtk-ip)',
      route: '/tools/ip-cidr',
      features: ['Endereço de rede', 'Máscara / Wildcard', 'Range de hosts', 'Classe da rede'],
      preview: `<div class="preview-regex">
  <div class="preview-line"><span class="json-key" style="color:var(--dtk-ip)">192.168.1.0/24</span></div>
  <div class="preview-line dim">Network: 192.168.1.0</div>
  <div class="preview-line dim">Broadcast: 192.168.1.255</div>
  <div class="preview-line dim">Hosts: 254 utilizáveis</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
      name: 'Text Case Converter',
      tagline: 'Converta entre camelCase, snake_case, kebab-case e mais',
      description: '9 formatos de capitalização diferentes em um só lugar. Perfeito para manter consistência em códigos com convenções de nomenclatura variadas.',
      color: 'var(--dtk-text-case)',
      route: '/tools/text-case',
      features: ['camelCase', 'PascalCase', 'snake_case', 'kebab-case', 'CONSTANT_CASE', 'Title Case'],
      preview: `<div class="preview-regex">
  <div class="preview-line"><span class="json-key" style="color:var(--dtk-text-case)">hello world</span></div>
  <div class="preview-line dim">camelCase → helloWorld</div>
  <div class="preview-line dim">snake_case → hello_world</div>
  <div class="preview-line dim">kebab-case → hello-world</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      name: 'XML Formatter',
      tagline: 'Formate e valide XML',
      description: 'Formate XML bagunçado com indentação perfeita, ou minifique para economizar espaço. Validação integrada com feedback de erros.',
      color: 'var(--dtk-xml)',
      route: '/tools/xml-formatter',
      features: ['Formatar XML', 'Minificar XML', 'Validação', 'Indentação automática'],
      preview: `<div class="preview-regex">
  <div class="preview-line"><span class="json-key" style="color:var(--dtk-xml)">&lt;note&gt;</span></div>
  <div class="preview-line indent1"><span class="json-key" style="color:var(--dtk-xml)">&lt;to&gt;</span>User<span class="json-key" style="color:var(--dtk-xml)">&lt;/to&gt;</span></div>
  <div class="preview-line indent1"><span class="json-key" style="color:var(--dtk-xml)">&lt;from&gt;</span>Dev<span class="json-key" style="color:var(--dtk-xml)">&lt;/from&gt;</span></div>
  <div class="preview-line"><span class="json-key" style="color:var(--dtk-xml)">&lt;/note&gt;</span></div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="4" height="4"/><rect x="7" y="17" width="3" height="3"/></svg>`,
      name: 'QR Code Generator',
      tagline: 'Crie QR codes a partir de qualquer texto',
      description: 'Gere QR codes para URLs, textos, contatos e muito mais. Escolha entre 4 tamanhos e baixe ou copie o QR code gerado.',
      color: 'var(--dtk-qr)',
      route: '/tools/qr-code',
      features: ['Texto para QR Code', '4 tamanhos', 'Download da imagem', 'Cópia do texto'],
      preview: `<div class="preview-regex">
  <div class="preview-line" style="text-align:center;font-size:20px;color:var(--dtk-qr)">&#9632;&#9632; &#9632;&#9632;&#9632; &#9632;&#9632;</div>
  <div class="preview-line" style="text-align:center;font-size:20px;color:var(--dtk-qr)">&#9632;  &#9632;  &#9632;</div>
  <div class="preview-line dim spacer"></div>
  <div class="preview-line dim">devtoolkit.app → QR Code</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
      name: 'Diff Checker',
      tagline: 'Compare textos lado a lado',
      description: 'Veja as diferenças entre dois textos com highlight visual. Linhas adicionadas em verde, removidas em vermelho, iguais em branco. Essencial para revisão de código.',
      color: 'var(--dtk-diff)',
      route: '/tools/diff-checker',
      features: ['Comparação linha a linha', 'Highlight adicionadas/removidas', 'Estatísticas', '100% client-side'],
      preview: `<div class="preview-regex">
  <div class="preview-line" style="color:var(--dtk-error)">- linha removida</div>
  <div class="preview-line" style="color:var(--dtk-success)">+ linha adicionada</div>
  <div class="preview-line dim">  linha igual</div>
  <div class="preview-line dim spacer"></div>
  <div class="preview-line dim">2 adicionadas • 1 removida • 3 iguais</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
      name: 'String Utilities',
      tagline: 'Analise e manipule strings',
      description: 'Ferramentas completas para análise de texto: contagem de caracteres, palavras, linhas, bytes, reversão, inversão de case e mais. Tudo em tempo real.',
      color: 'var(--dtk-string)',
      route: '/tools/string-utils',
      features: ['Contagem caracteres', 'Contagem palavras', 'Reversão', 'Inversão de case', 'Tamanho em bytes'],
      preview: `<div class="preview-regex">
  <div class="preview-line"><span class="json-key" style="color:var(--dtk-string)">Hello World</span></div>
  <div class="preview-line dim">Chars: 11 • Words: 2 • Bytes: 11</div>
  <div class="preview-line dim">Reversed: dlroW olleH</div>
  <div class="preview-line dim">Inverted: hELLO wORLD</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="12" y1="12" x2="12" y2="20"/></svg>`,
      name: 'Lorem Ipsum Generator',
      tagline: 'Texto placeholder para seus projetos',
      description: 'Gere texto Lorem Ipsum em parágrafos, frases ou palavras. Quantidade ajustável com botões +/−. Copie o resultado com um clique.',
      color: 'var(--dtk-lorem)',
      route: '/tools/lorem-ipsum',
      features: ['Parágrafos', 'Frases', 'Palavras', 'Quantidade ajustável'],
      preview: `<div class="preview-regex">
  <div class="preview-line dim">Lorem ipsum dolor sit amet,</div>
  <div class="preview-line dim">consectetur adipiscing elit.</div>
  <div class="preview-line dim spacer"></div>
  <div class="preview-line">3 parágrafos gerados</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      name: 'HTTP Client',
      tagline: 'Faça requisições HTTP como um profissional',
      description: 'Interface completa no nível do Postman. Suporta GET, POST, PUT, PATCH, DELETE, HEAD e OPTIONS. Adicione headers, parâmetros, autenticação e corpo da requisição com editor de JSON/Text.',
      color: 'var(--dtk-http)',
      route: '/tools/http-client',
      features: ['7 métodos HTTP', 'Headers & Params', 'Auth (Bearer/Basic/API Key)', 'Copy as cURL', 'Métricas de resposta'],
      preview: `<div class="preview-http">
  <div class="preview-line"><span class="http-method">GET</span><span class="http-url">api/users?page=1</span><span class="http-status">200 OK</span></div>
  <div class="preview-line dim"><span class="http-label">Content-Type:</span> application/json</div>
  <div class="preview-line dim"><span class="http-label">Authorization:</span> Bearer ••••••••</div>
  <div class="preview-line spacer"></div>
  <div class="preview-line"><span class="json-bracket">{</span></div>
  <div class="preview-line indent1"><span class="json-key">"users"</span>: <span class="json-bracket">[</span></div>
  <div class="preview-line indent2"><span class="json-bracket">{</span> <span class="json-key">"id"</span>: <span class="json-num">1</span>, <span class="json-key">"name"</span>: <span class="json-str">"John Doe"</span> <span class="json-bracket">}</span></div>
  <div class="preview-line indent2"><span class="json-bracket">{</span> <span class="json-key">"id"</span>: <span class="json-num">2</span>, <span class="json-key">"name"</span>: <span class="json-str">"Jane Smith"</span> <span class="json-bracket">}</span></div>
  <div class="preview-line indent1"><span class="json-bracket">]</span></div>
  <div class="preview-line"><span class="json-bracket">}</span></div>
  <div class="preview-line dim spacer"></div>
  <div class="preview-line"><span class="http-label">Status:</span> 200 <span class="dim">•</span> <span class="http-label">Time:</span> 234ms <span class="dim">•</span> <span class="http-label">Size:</span> 1.2 KB</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      name: 'JSON Formatter',
      tagline: 'Formate, valide e explore qualquer JSON',
      description: 'Cole seu JSON bagunçado e receba ele formatado, minificado ou validado instantaneamente. Visualização em árvore interativa com busca por JSONPath para navegar em estruturas complexas.',
      color: 'var(--dtk-json)',
      route: '/tools/json-formatter',
      features: ['Formatar & Minificar', 'Validação', 'Tree View interativa', 'JSONPath', 'Copiar formatado'],
      preview: `<div class="preview-json">
  <div class="preview-toolbar">
    <span class="preview-tab active">Formatado</span>
    <span class="preview-tab">Tree View</span>
  </div>
  <div class="preview-line"><span class="json-bracket">{</span></div>
  <div class="preview-line indent1"><span class="json-key">"name"</span>: <span class="json-str">"DevToolkit"</span>,</div>
  <div class="preview-line indent1"><span class="json-key">"version"</span>: <span class="json-num">1.0</span>,</div>
  <div class="preview-line indent1"><span class="json-key">"tools"</span>: <span class="json-bracket">[</span></div>
  <div class="preview-line indent2"><span class="json-bracket">{</span> <span class="json-key">"id"</span>: <span class="json-str">"http"</span>, <span class="json-key">"active"</span>: <span class="json-bool">true</span> <span class="json-bracket">}</span>,</div>
  <div class="preview-line indent2"><span class="json-bracket">{</span> <span class="json-key">"id"</span>: <span class="json-str">"json"</span>, <span class="json-key">"active"</span>: <span class="json-bool">true</span> <span class="json-bracket">}</span></div>
  <div class="preview-line indent1"><span class="json-bracket">]</span></div>
  <div class="preview-line"><span class="json-bracket">}</span></div>
  <div class="preview-line dim spacer"></div>
  <div class="preview-line"><span class="json-valid">&check; Válido</span> <span class="dim">—</span> 12 linhas <span class="dim">—</span> 145 bytes</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      name: 'JWT Decoder',
      tagline: 'Decodifique e verifique tokens JWT',
      description: 'Cole qualquer token JWT e veja instantaneamente o header, payload e signature decodificados. Timer de expiração em tempo real, verificação de assinatura e formatação legível das claims.',
      color: 'var(--dtk-jwt)',
      route: '/tools/jwt-decoder',
      features: ['Decodificar Header/Payload', 'Verificar Assinatura', 'Timer de Expiração', 'Claims formatadas', '100% client-side'],
      preview: `<div class="preview-jwt">
  <div class="jwt-token">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI.Ol0K...</div>
  <div class="jwt-parts">
    <div class="jwt-part" style="--part-color: var(--dtk-http)">
      <div class="jwt-part-header">HEADER</div>
      <div class="jwt-part-body">{ "alg": "HS256", "typ": "JWT" }</div>
    </div>
    <div class="jwt-part" style="--part-color: var(--dtk-json)">
      <div class="jwt-part-header">PAYLOAD</div>
      <div class="jwt-part-body"><span class="json-key">"sub"</span>: <span class="json-num">123</span>, <span class="json-key">"name"</span>: <span class="json-str">"John"</span>, <span class="json-key">"iat"</span>: <span class="json-num">1720000000</span></div>
    </div>
    <div class="jwt-part" style="--part-color: var(--dtk-sql)">
      <div class="jwt-part-header">SIGNATURE</div>
      <div class="jwt-part-body"><span class="json-valid">Verified</span></div>
    </div>
  </div>
  <div class="preview-line dim"><span class="json-valid">&check; Válido</span> <span class="dim">—</span> Expira em 23h 45m</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
      name: 'SQL Formatter',
      tagline: 'SQL limpo e legível em qualquer dialeto',
      description: 'Suporta 15 dialetos de banco de dados. Formate SQL bagunçado com indentação configurável, uppercase/lowercase para palavras-chave e minificação quando precisar.',
      color: 'var(--dtk-sql)',
      route: '/tools/sql-formatter',
      features: ['15 Dialetos', 'UPPER/lower case', 'Indentação configurável', 'Minificar', 'Copiar formatado'],
      preview: `<div class="preview-sql">
  <div class="preview-line"><span class="sql-keyword">SELECT</span></div>
  <div class="preview-line indent1"><span class="sql-field">u.name</span>,</div>
  <div class="preview-line indent1"><span class="sql-field">u.email</span>,</div>
  <div class="preview-line indent1"><span class="sql-field">COUNT</span>(<span class="sql-field">o.id</span>) <span class="sql-keyword">AS</span> <span class="sql-field">orders</span></div>
  <div class="preview-line"><span class="sql-keyword">FROM</span> <span class="sql-table">users</span> <span class="sql-alias">u</span></div>
  <div class="preview-line"><span class="sql-keyword">LEFT JOIN</span> <span class="sql-table">orders</span> <span class="sql-alias">o</span></div>
  <div class="preview-line indent1"><span class="sql-keyword">ON</span> <span class="sql-field">u.id</span> = <span class="sql-field">o.user_id</span></div>
  <div class="preview-line"><span class="sql-keyword">WHERE</span> <span class="sql-field">u.active</span> = <span class="sql-bool">true</span></div>
  <div class="preview-line"><span class="sql-keyword">ORDER BY</span> <span class="sql-field">u.name</span> <span class="sql-keyword">ASC</span></div>
  <div class="preview-line dim spacer"></div>
  <div class="preview-line dim">PostgreSQL <span class="dim">•</span> UPPER keywords <span class="dim">•</span> 2 spaces indent</div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/><path d="M11 8v6"/></svg>`,
      name: 'Regex Tester',
      tagline: 'Teste regex com highlight em tempo real',
      description: 'Escreva sua expressão regular e veja os matches destacados inline no texto de teste. Visualize grupos de captura, ative flags (g, i, m, s, u) e veja a contagem de matches instantaneamente.',
      color: 'var(--dtk-regex)',
      route: '/tools/regex-tester',
      features: ['Highlight inline', 'Grupos de captura', 'Flags (g/i/m/s/u)', 'Contador de matches', 'Exemplos prontos'],
      preview: `<div class="preview-regex">
  <div class="preview-regex-pattern">
    <span class="regex-delim">/</span><span class="regex-pattern">(\\w+)@(\\w+)\\.(\\w+)</span><span class="regex-delim">/</span><span class="regex-flags">gi</span>
  </div>
  <div class="preview-regex-text">
    <span class="regex-text">Contact us at </span>
    <span class="regex-match">john@email.com</span>
    <span class="regex-text"> or </span>
    <span class="regex-match">support@test.com</span>
    <span class="regex-text"> for help.</span>
  </div>
  <div class="preview-line dim spacer"></div>
  <div class="preview-line"><span class="json-valid">2 matches</span></div>
  <div class="preview-line dim">Match 1: <span class="regex-group">john</span> @ <span class="regex-group">email</span> . <span class="regex-group">com</span></div>
  <div class="preview-line dim">Match 2: <span class="regex-group">support</span> @ <span class="regex-group">test</span> . <span class="regex-group">com</span></div>
</div>`
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
      name: 'UUID Generator',
      tagline: 'Gere UUIDs únicos em múltiplos formatos',
      description: 'Gere UUIDs nas versões v1, v4 e v7. Escolha entre formatos dashed, curly, uppercase, lowercase. Geração em lote para até 100 UUIDs de uma vez com cópia em massa.',
      color: 'var(--dtk-uuid)',
      route: '/tools/uuid-generator',
      features: ['v1 / v4 / v7', 'Múltiplos formatos', 'Geração em lote', 'Copiar tudo', 'Download .txt'],
      preview: `<div class="preview-uuid">
  <div class="preview-uuid-options">
    <span class="uuid-option active">v4</span>
    <span class="uuid-option">v7</span>
    <span class="uuid-option dashed">Dashed</span>
    <span class="uuid-option">UPPER</span>
  </div>
  <div class="uuid-list">
    <div class="uuid-item"><span class="uuid-num">#1</span> 550e8400-e29b-41d4-a716-446655440000</div>
    <div class="uuid-item"><span class="uuid-num">#2</span> 6ba7b810-9dad-11d1-80b4-00c04fd430c8</div>
    <div class="uuid-item"><span class="uuid-num">#3</span> f47ac10b-58cc-4372-a567-0e02b2c3d479</div>
    <div class="uuid-item more">+ 2 more</div>
  </div>
  <div class="preview-line dim spacer"></div>
  <div class="preview-line dim">Version: v4 <span class="dim">•</span> Format: dashed <span class="dim">•</span> 5 generated</div>
</div>`
    }
  ];

  constructor() {
    afterNextRender(() => {
      const sections = document.querySelectorAll<HTMLElement>('.tool-section');
      sections.forEach((section, i) => {
        if (i === 0) {
          setTimeout(() => this.startDemo(section), 800);
        } else {
          const obs = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) {
              obs.disconnect();
              this.startDemo(section);
            }
          }, { threshold: 0.3 });
          obs.observe(section);
        }
      });
    });
  }

  private async startDemo(container: HTMLElement) {
    const preview = container.querySelector<HTMLElement>('.preview-card');
    if (!preview) return;

    const lines = preview.querySelectorAll<HTMLElement>('.preview-line');
    if (!lines.length) return;

    while (true) {
      await this.runCycle(lines);
    }
  }

  private async runCycle(lines: NodeListOf<HTMLElement>) {
    gsap.set(lines, { clipPath: 'inset(0 100% 0 0)' });
    await this.wait(100);

    gsap.to(lines, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.35,
      stagger: 0.06,
      ease: 'none',
      overwrite: 'auto',
    });

    await this.wait(lines.length * 60 + 350 + 3000);

    gsap.to(lines, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 0.2,
      stagger: 0.02,
      ease: 'power2.in',
      overwrite: 'auto',
    });

    await this.wait(500);
  }

  private wait(ms: number) {
    return new Promise<void>(r => setTimeout(r, ms));
  }
}
