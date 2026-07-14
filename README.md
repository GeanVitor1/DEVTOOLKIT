# 🛠️ DevToolkit

> Premium developer toolkit — 6 professional tools for your daily workflow.

![Angular](https://img.shields.io/badge/Angular-21-0f0f11?logo=angular)
![.NET](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?logo=microsoft-sql-server)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker)

**DevToolkit** is a premium collection of developer tools built with Angular 21 and .NET 10. It features a professional dark-themed interface with 6 essential tools for developers.

## ✨ Tools

| Tool | Description |
|------|-------------|
| 🌐 **HTTP Client** | Postman-level interface with tabs, headers, params, auth, body editor, and formatted response |
| { } **JSON Formatter** | Format, minify, validate JSON with tree view and JSONPath query |
| 🔐 **JWT Decoder** | Decode and inspect JWT tokens with header, payload, signature, and expiration timer |
| 🗄️ **SQL Formatter** | Format SQL across 15 dialects with configurable case and indentation |
| .\* **Regex Tester** | Test regular expressions with inline highlighting, match groups, and flag toggles |
| 🔑 **UUID Generator** | Generate UUIDs v1/v4/v7 in multiple formats with bulk generation |

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- .NET 10 SDK
- Docker (optional)

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
dotnet run --project src/DevToolkit.API
```

### Docker

```bash
docker compose up
```

## 🏗️ Architecture

```
dev-toolkit/
├── frontend/          # Angular 21 standalone
│   ├── src/app/
│   │   ├── core/      # Layout, services, shared components
│   │   ├── landing/   # Landing page
│   │   ├── tools/     # 6 tool components (lazy loaded)
│   │   └── shared/    # Utils, validators
│   └── ...
├── backend/           # .NET 10 Clean Architecture
│   └── src/
│       ├── DevToolkit.Domain/
│       ├── DevToolkit.Application/
│       ├── DevToolkit.Infrastructure/
│       └── DevToolkit.API/
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## 🧪 Tests

```bash
cd frontend
npm test
```

## 📦 Deploy

- **Frontend:** Vercel (manual) — `vercel.json` configured
- **Backend:** Railway (manual) — Dockerfile included

## 🎨 Design

- **Theme:** Dark-first with light mode toggle
- **Colors:** 6 tool-specific accent colors
- **Fonts:** Inter (UI) + JetBrains Mono (code)
- **Stack:** Angular 21 standalone, Signals, OnPush

## 📄 License

MIT
