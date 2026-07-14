# 🛠️ DevToolkit — Plano de Implementação V1

> **Stack:** Angular 21 (standalone) + .NET 10 + SQL Server + Docker  
> **Deploy:** Vercel (manual) + Railway (manual)  
> **Foco:** Produto premium para portfólio — poucas ferramentas, qualidade máxima

---

## 1. Stack

| Categoria | Tecnologia |
|---|---|
| Frontend | Angular 21 (standalone, signals, OnPush) |
| Build | Angular CLI + Vite |
| CSS | SCSS + custom properties (design system próprio) |
| State | Signals |
| Testes | Vitest + jsdom |
| Backend | .NET 10 (Clean Architecture simplificada) |
| Banco | SQL Server |
| Package | npm |
| Deploy Front | Vercel (manual) |
| Deploy Back | Railway (manual) |
| CI | GitHub Actions (build + lint + test) |
| Docker | Dockerfile front + back + docker-compose |

---

## 2. Escopo V1

### Ferramentas (6)

| # | Ferramenta | Destaque |
|---|---|---|
| 1 | **HTTP Client** | Interface nível Postman — tabs, headers, params, body, response, timeline |
| 2 | **JSON Formatter** | Format, minify, validate, tree view, JSONPath |
| 3 | **JWT Decoder** | Header, payload, signature, datas formatadas, timer de expiração |
| 4 | **SQL Formatter** | 15 dialetos, uppercase/lowercase, indent configurável |
| 5 | **Regex Tester** | Highlight inline, lista de grupos, flags, contador |
| 6 | **UUID Generator** | v1/v4/v7, formatos (dashed, curly, upper), bulk generation |

### Landing Page (prioridade máxima)

Hero impactante, cards modernos com ícones SVG, micro-animações, CTA, tema escuro premium, responsividade impecável.

### Backend (mínimo necessário)

| Endpoint | Função |
|---|---|
| `POST /api/proxy` | Executar HTTP requests server-side (evitar CORS) |
| `GET /api/health` | Health check |

### Infra

- Dockerfile frontend + backend
- docker-compose.yml
- CI (build + lint + test)
- Deploy manual Vercel + Railway

---

## 3. Estrutura de Diretórios

```
dev-toolkit/
├── .github/workflows/ci.yml
├── frontend/
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── proxy.conf.json
│   ├── vercel.json
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── public/
│   │   └── assets/
│   │       ├── icons/          # SVG icons das 6 ferramentas + logo
│   │       ├── og-image.png
│   │       └── illustrations/  # Ilustrações da landing page
│   └── src/
│       ├── index.html
│       ├── main.ts
│       ├── styles.scss
│       ├── environments/
│       └── app/
│           ├── app.routes.ts
│           ├── app.config.ts
│           ├── core/
│           │   ├── layout/
│           │   │   ├── tool-layout.component.ts
│           │   │   ├── tool-layout.component.scss
│           │   │   ├── sidebar.component.ts
│           │   │   ├── sidebar.component.scss
│           │   │   └── header.component.ts
│           │   │   └── header.component.scss
│           │   ├── services/
│           │   │   ├── theme.service.ts      # Dark/light toggle
│           │   │   └── clipboard.service.ts  # Copy utility
│           │   └── components/
│           │       ├── code-editor.component.ts
│           │       ├── copy-button.component.ts
│           │       ├── toast.component.ts
│           │       └── empty-state.component.ts
│           ├── landing/
│           │   ├── landing-page.component.ts
│           │   ├── landing-page.component.scss
│           │   ├── components/
│           │   │   ├── hero-section.component.ts
│           │   │   ├── features-section.component.ts
│           │   │   ├── tools-grid-section.component.ts
│           │   │   └── footer-section.component.ts
│           ├── tools/
│           │   ├── tools.routes.ts
│           │   ├── http-client/
│           │   ├── json-formatter/
│           │   ├── jwt-decoder/
│           │   ├── sql-formatter/
│           │   ├── regex-tester/
│           │   └── uuid-generator/
│           └── shared/
│               └── utils/
│                   ├── debounce.ts
│                   └── validators.ts
│
├── backend/
│   ├── DevToolkit.slnx
│   ├── src/
│   │   ├── DevToolkit.Domain/
│   │   │   └── Entities/
│   │   │       └── ProxyRequest.cs
│   │   └── ProxyResponse.cs
│   │   ├── DevToolkit.Application/
│   │   │   ├── Interfaces/
│   │   │   │   └── IProxyService.cs
│   │   │   ├── DTOs/
│   │   │   │   ├── ProxyRequestDto.cs
│   │   │   │   └── ProxyResponseDto.cs
│   │   │   └── Services/
│   │   │       └── ProxyService.cs
│   │   ├── DevToolkit.Infrastructure/
│   │   │   └── Proxy/
│   │   │       └── HttpClientProxy.cs
│   │   └── DevToolkit.API/
│   │       ├── Program.cs
│   │       ├── Controllers/
│   │       │   ├── ProxyController.cs
│   │       │   └── HealthController.cs
│   │       └── Middleware/
│   │           └── ExceptionHandlingMiddleware.cs
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
├── .editorconfig
└── README.md
```

---

## 4. Design System

### 4.1 Paleta de Cores

```scss
// === DARK THEME (padrão) ===
--dtk-bg-base:        #0b0d14;
--dtk-bg-surface:     #141620;
--dtk-bg-elevated:    #1c1f2e;
--dtk-bg-hover:       #242840;
--dtk-bg-input:       #10121c;
--dtk-border:         #262a3e;
--dtk-border-focus:   #6c5ce7;
--dtk-text-primary:   #e2e4f0;
--dtk-text-secondary: #8b8fa3;
--dtk-text-muted:     #4a4e62;

// Tool colors (cada ferramenta tem sua identidade)
--dtk-http:     #5cd4fc;  // ciano
--dtk-json:     #a78bfa;  // violeta
--dtk-jwt:      #fb7185;  // rosa
--dtk-sql:      #34d399;  // verde
--dtk-regex:    #fb923c;  // laranja
--dtk-uuid:     #22d3ee;  // ciano claro

// Status
--dtk-success:  #34d399;
--dtk-warning:  #fbbf24;
--dtk-error:    #f87171;
--dtk-info:     #60a5fa;
```

### 4.2 Tipografia

```scss
--dtk-font-sans: 'Inter', -apple-system, sans-serif;
--dtk-font-mono: 'JetBrains Mono', 'Fira Code', monospace;

--dtk-text-xs:   0.75rem;   // 12px
--dtk-text-sm:   0.8125rem; // 13px
--dtk-text-base: 0.875rem;  // 14px
--dtk-text-lg:   1rem;      // 16px
--dtk-text-xl:   1.25rem;   // 20px
--dtk-text-2xl:  1.5rem;    // 24px
--dtk-text-3xl:  2rem;      // 32px
```

### 4.3 Layout

```
┌──────────┬──────────────────────────────────────────────┐
│          │  Header (tool name, breadcrumb, theme toggle) │
│ Sidebar  │  height: 56px                                 │
│ 260px    ├──────────────────────────────────────────────┤
│ fixed    │                                               │
│ scroll   │  <router-outlet />                            │
│          │  (tool page content)                          │
│          │                                               │
└──────────┴──────────────────────────────────────────────┘
```

### 4.4 Sidebar

```
🛠️ DevToolkit
───────────────
🌐 Rede
  HTTP Client
  JWT Decoder

📄 Dados
  JSON Formatter
  SQL Formatter

🔤 Utilitários
  Regex Tester
  UUID Generator
```

Cada item tem: ícone SVG 20px + label + active state com borda esquerda 3px na cor da tool.

---

## 5. Views das Ferramentas

Todas seguem o mesmo padrão de layout:

```
┌──────────────────────────────────────────────┐
│  Header: ícone + nome + descrição + cor tool │
├──────────────────────────────────────────────┤
│  Action Bar (botões específicos da tool)      │
├──────────────────────────────────────────────┤
│  ┌────────── RESIZE ────────────────────┐    │
│  │  Input Panel       Output Panel     │    │
│  │  (CodeMirror)      (resultado)      │    │
│  └──────────────────────────────────────┘    │
├──────────────────────────────────────────────┤
│  Status Bar (linhas, tamanho, validação)      │
└──────────────────────────────────────────────┘
```

SplitPane redimensionável com `cursor: col-resize`. Em mobile (< 768px) empilha vertical.

---

### 5.1 HTTP Client

**A ferramenta principal — nível Postman.**

```
┌──────────────────────────────────────────────────────────────────┐
│  [▼ GET] [___________________________URL___________________] [Send]│
│                                                                    │
│  [Params ▸] [Headers ▸] [Auth ▸] [Body ▸]  (tabs com underline)   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Content-Type: [application/json  ▼]                        │   │
│  │ Authorization: [________________________________]         │   │  ← Key-value table
│  │ [+] Add Header                                              │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Body (CodeMirror — JSON/XML/Text)                          │   │
│  │ { "name": "John" }                                         │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  [📤 Send]  [💾 Save]  [📋 Copy as cURL]                         │
├──────────────────────────────────────────────────────────────────────┤
│  ┌──────────┬──────────┬──────────┬──────────────┐                 │
│  │ Status   │ Time     │ Size     │ Headers      │                 │
│  │ 200 ✅   │ 234ms    │ 1.2KB    │ 12           │                 │
│  └──────────┴──────────┴──────────┴──────────────┘                 │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Response Body (CodeMirror read-only, syntax highlight)     │   │
│  │ { "id": 1, "name": "John", "email": "john@email.com" }    │   │
│  └────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

**Componentes internos:**
- `UrlBarComponent` — método dropdown + URL input + send button
- `TabGroupComponent` — tabs com slide animation
- `KeyValueTableComponent` — para headers/params (add row, delete row, autocomplete)
- `AuthPanelComponent` — Bearer/Basic/API Key
- `RequestBodyComponent` — CodeMirror
- `ResponseMetaComponent` — 4 cards (status, time, size, headers)
- `ResponseBodyComponent` — CodeMirror read-only

**Estados:**
- **Vazio:** `EmptyStateComponent` — "Enter a URL to get started" + botão "Example Request"
- **Loading:** Botão Send vira spinner + skeleton nos metadados
- **Erro:** Toast + response panel vermelho + mensagem de erro
- **Sucesso:** Response panel verde + body formatado + metadados animados

---

### 5.2 JSON Formatter

```
┌──────────────────────┬──────────────────────────────┐
│  [Format▼] [Minify]  │  [Validate] [Clear] [Example]│
├──────────────────────┴──────────────────────────────┤
│  ┌──────────┬───────────────────────────────┐       │
│  │  Input   │  Output (formatado)           │       │
│  │  {       │  {                            │       │
│  │  "name": │    "name": "John Doe",       │       │
│  │  "John"  │    "age": 30,                │       │
│  │  }       │    "email": "john@test.com"  │       │
│  │          │  }                            │       │
│  └──────────┴───────────────────────────────┘       │
├─────────────────────────────────────────────────────┤
│  ▼ Tree View                                         │
│  📁 root (object)                                    │
│    ├── 📄 name: "John Doe" (string)                  │
│    ├── 📄 age: 30 (number)                           │
│    └── 📄 email: "john@test.com" (string)            │
│                                                       │
│  🔍 JSONPath: $.name  →  "John Doe"                  │
├─────────────────────────────────────────────────────┤
│  Lines: 5  •  Size: 89 chars  •  ✅ Valid JSON       │
└─────────────────────────────────────────────────────┘
```

---

### 5.3 JWT Decoder

```
┌──────────────────────────────────────────────────────────┐
│  Token                                                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.           │   │
│  │ eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4g..  │   │
│  └──────────────────────────────────────────────────┘   │
│  [Paste] [Clear] [Example]   🔒 100% client-side        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │  HEADER  │  │   PAYLOAD      │  │  SIGNATURE     │    │
│  │          │  │                │  │                │    │
│  │ {        │  │ sub: 1234567890│  │ HMACSHA256(    │    │
│  │  "alg":  │  │ name: John Doe│  │  base64...     │    │
│  │  "HS256",│  │ iat: 12/07    │  │ )              │    │
│  │  "typ":  │  │ exp: 14/07    │  │                │    │
│  │  "JWT"   │  │               │  │ [Verify] ✅    │    │
│  │ }        │  │               │  │                │    │
│  └──────────┘  └────────────────┘  └────────────────┘    │
│                                                           │
│  ⏰ Válido • Expira em 23h 45m                            │
└──────────────────────────────────────────────────────────┘
```

---

### 5.4 SQL Formatter

```
┌──────────────────────────────────────────────────────────┐
│  Dialect: [▼ PostgreSQL]  Case: [▼ UPPER]  Indent: [2]  │
│  [Format] [Minify] [Clear] [Example]                     │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────────┬──────────────────────────┐     │
│  │  Input               │  Output                  │     │
│  │  select * from users │  SELECT                  │     │
│  │  where age > 18      │    *                     │     │
│  │  order by name       │  FROM                    │     │
│  │                      │    users                 │     │
│  │                      │  WHERE                   │     │
│  │                      │    age > 18              │     │
│  │                      │  ORDER BY                │     │
│  │                      │    name                  │     │
│  └──────────────────────┴──────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

---

### 5.5 Regex Tester

```
┌──────────────────────────────────────────────────────────┐
│  Pattern: /(\w+)@(\w+)\.(\w+)/                           │
│  Flags: [■ g] [■ i] [□ m] [□ s] [□ u]                   │
├──────────────────────────────────────────────────────────┤
│  Test String                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Contact: john@email.com and support@test.com     │   │
│  │          ██████████████         ██████████████   │   │  ← highlight
│  └──────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────┤
│  2 matches found                                         │
│                                                          │
│  #1 "john@email.com"                                     │
│     Group 1: "john"   Group 2: "email"   Group 3: "com" │
│                                                          │
│  #2 "support@test.com"                                   │
│     Group 1: "support"   Group 2: "test"   Group 3: "com"│
└──────────────────────────────────────────────────────────┘
```

---

### 5.6 UUID Generator

```
┌──────────────────────────────────────────────────────────┐
│  Version: [▼ v4]  Format: [▼ Dashed]  Case: [▼ UPPER]   │
│  Quantity: [5]  [Generate]  [Copy All]  [Download .txt]  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  #1  550E8400-E29B-41D4-A716-446655440000    [Copy]      │
│  #2  6BA7B810-9DAD-11D1-80B4-00C04FD430C8    [Copy]      │
│  #3  F47AC10B-58CC-4372-A567-0E02B2C3D479    [Copy]      │
│  #4  02E2C3D4-8B10-47AC-A567-0E02B2C3D479    [Copy]      │
│  #5  1B9D11D1-80B4-4A43-A567-0E02B2C3D479    [Copy]      │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Shared Components

| Componente | Props | Usado por |
|---|---|---|
| `DtkCodeEditor` | `[(code)]`, `language`, `readonly`, `height`, `placeholder` | HTTP, JSON, SQL, Regex |
| `DtkCopyButton` | `value`, `size`, `label?` | Todas |
| `DtkToast` | `message`, `type`(success/error/info), `duration` | Global |
| `DtkEmptyState` | `icon`, `title`, `description`, `actionLabel`, `(action)` | Todas |
| `DtkSplitPane` | `left`, `right`, `orientation`, `defaultRatio` | JSON, SQL |
| `DtkTabs` | `tabs[]`, `[(active)]`, `(tabChange)` | HTTP Client |
| `DtkKeyValueTable` | `[(rows)]`, `keyPlaceholder`, `valuePlaceholder`, `autocompleteKeys` | HTTP Client |
| `DtkToolHeader` | `icon`, `name`, `description`, `color` | Todas |

---

## 7. Backend

### Endpoints

| Método | Rota | Request | Response |
|---|---|---|---|
| POST | `/api/proxy` | `{ method, url, headers, body, timeoutMs }` | `{ statusCode, headers, body, timingMs, sizeBytes }` |
| GET | `/api/health` | — | `{ status: "healthy", timestamp, version }` |

### ProxyService (regras)

- Timeout máximo: 30s
- Tamanho máximo response: 5MB
- Bloquear IPs internos (127.0.0.1, 10.x, 172.16-31.x, 192.168.x)
- Bloquear requisições para localhost
- Logar erros sem expor detalhes internos

### Clean Architecture (simplificada)

```
DevToolkit.Domain
  └── Entities/
       ├── ProxyRequest.cs
       └── ProxyResponse.cs

DevToolkit.Application
  ├── Interfaces/IProxyService.cs
  ├── DTOs/ProxyRequestDto.cs, ProxyResponseDto.cs
  └── Services/ProxyService.cs

DevToolkit.Infrastructure
  └── Proxy/HttpClientProxy.cs

DevToolkit.API
  ├── Program.cs
  ├── Controllers/ProxyController.cs, HealthController.cs
  └── Middleware/ExceptionHandlingMiddleware.cs
```

Sem banco de dados, sem migrations, sem identidade. Apenas o necessário.

---

## 8. Dependências

```json
{
  "dependencies": {
    "@angular/core": "^21.2.0",
    "@angular/router": "^21.2.0",
    "@angular/forms": "^21.2.0",
    "codemirror": "^6.0.0",
    "@codemirror/lang-json": "^6.0.0",
    "@codemirror/lang-sql": "^6.0.0",
    "@codemirror/lang-javascript": "^6.0.0",
    "sql-formatter": "^15.0.0",
    "rxjs": "~7.8.0"
  },
  "devDependencies": {
    "vitest": "^4.0.0",
    "jsdom": "^28.0.0"
  }
}
```

**Justificativa:** Só CodeMirror (editor) + sql-formatter. Regex, UUID, JWT são nativos. JSON é `JSON.parse/stringify`.

---

## 9. Docker

### docker-compose.yml

```yaml
services:
  frontend:
    build: ./frontend
    ports: ["4200:80"]
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["5000:8080"]
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
```

### Frontend Dockerfile

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=build /app/dist/dev-toolkit/browser /usr/share/nginx/html
EXPOSE 80
```

### Backend Dockerfile

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app
COPY . .
RUN dotnet restore && dotnet publish -c Release -o /publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "DevToolkit.API.dll"]
```

---

## 10. CI (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  frontend:
    name: Frontend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test -- --run

  backend:
    name: Backend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '10.0.x'
      - run: dotnet restore
      - run: dotnet build --no-restore --configuration Release
      - run: dotnet test --no-build --configuration Release
```

---

## 11. Cronograma — 30 Dias

| Semana | Dias | Foco | Entregáveis |
|---|---|---|---|
| **S1** | 1–5 | **Fundação** | Scaffold Angular, design system, layout base (sidebar + header), landing page premium (hero, tools grid, features), tema dark/light, Docker, CI |
| **S2** | 6–12 | **Core Tools 1** | JSON Formatter (editor, format/minify/validate, tree view, JSONPath), JWT Decoder (decode, verify, timer), UUID Generator (v4/v7, formatos, bulk) |
| **S3** | 13–20 | **Ferramentas Avançadas** | HTTP Client (url bar, tabs, headers, params, body, response, timeline, proxy backend), SQL Formatter (dialetos, uppercase, indent), Regex Tester (highlight, grupos, flags) |
| **S4** | 21–25 | **Polimento** | Responsividade (mobile, tablet, desktop), micro-animações, empty/loading/error states, testes (Vitest), ajustes finos de UX |
| **S5** | 26–30 | **Deploy & QA** | Deploy manual Vercel + Railway, teste cross-browser, lighthouse audit, README, último review de qualidade |

---

## 12. Roadmap

### V1 — Lançamento (Portfólio)

- [x] Landing page premium com animações
- [x] Layout profissional (sidebar + header + tema)
- [x] HTTP Client (nível Postman)
- [x] JSON Formatter (com tree view + JSONPath)
- [x] JWT Decoder (com timer de expiração)
- [x] SQL Formatter (15 dialetos)
- [x] Regex Tester (highlight + grupos)
- [x] UUID Generator (v1/v4/v7)
- [x] Backend proxy (evitar CORS)
- [x] Docker (dev)
- [x] CI (build + lint + test)
- [x] Deploy manual (Vercel + Railway)

### V2 — Futuro (quando aplicável)

- [ ] Autenticação (login/register)
- [ ] Snippets salvos
- [ ] Histórico de uso
- [ ] Favoritos
- [ ] Base64
- [ ] Markdown Preview
- [ ] XML Formatter
- [ ] Cron Builder
- [ ] Hash Generator
- [ ] Compartilhamento público de snippets
- [ ] Perfil do usuário

---

## 13. Objetivo Final

> **Qualidade > Quantidade.**  
> 6 ferramentas perfeitas > 12 ferramentas meia-boca.  
> O projeto deve parecer um software comercial pronto para uso.

| Aspecto | Meta |
|---|---|
| Interface | Premium, consistente, responsiva |
| UX | Intuitiva, feedback imediato, zero fricção |
| Código | Limpo, componentizado, tipado |
| Arquitetura | Organizada, escalável, testável |
| Performance | Lighthouse > 90, bundle < 200KB |

---

> **Documento:** DEVTOOLKIT_PLAN.md  
> **Data:** 13/07/2026  
> **Autor:** Gean Vitor  
> **Versão:** V1 — Portfólio
