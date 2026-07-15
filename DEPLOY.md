# Deploy: Vercel (frontend) + Render (backend)

## Visão geral

| Serviço   | Plataforma | Root Directory | URL típica                          |
|-----------|------------|----------------|-------------------------------------|
| Frontend  | Vercel     | `frontend`     | `https://seu-app.vercel.app`        |
| Backend   | Render     | `backend`      | `https://devtoolkit-api.onrender.com` |

O HTTP Client do app chama `POST /api/proxy` no backend para contornar CORS.

---

## 1. Backend no Render

### Opção A — Docker (recomendado)

1. [Render](https://render.com) → **New** → **Web Service**
2. Conecte o repositório GitHub
3. Configurações:
   - **Root Directory:** `backend`
   - **Runtime:** Docker
   - **Dockerfile Path:** `./Dockerfile`
   - **Health Check Path:** `/health`
4. Environment Variables:
   | Key | Value |
   |-----|--------|
   | `ASPNETCORE_ENVIRONMENT` | `Production` |
   | `CORS_ORIGINS` | `https://seu-app.vercel.app` (vírgula se tiver mais de um) |

Sem `CORS_ORIGINS`, o API ainda libera `*.vercel.app` e `localhost` em produção.

### Opção B — Blueprint

Na pasta `backend/` existe `render.yaml`. No Render: **New Blueprint** e aponte para o repo (Root = `backend` se pedido).

### Teste

```bash
curl https://SEU-SERVICO.onrender.com/health
# {"status":"healthy",...}
```

> Free tier do Render “dorme” após inatividade. O primeiro request pode demorar ~30–60s.

### Local

```bash
cd backend
dotnet run --project src/DevToolkit.API
# http://localhost:5207/health
```

---

## 2. Frontend na Vercel

1. [Vercel](https://vercel.com) → **Add New Project** → repo
2. Configurações:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Other (usa `vercel.json`)
   - **Build Command:** `npm run build` (já gera env + `ng build`)
   - **Output Directory:** `dist/dev-toolkit/browser`
   - **Install Command:** `npm ci`
3. Environment Variables (Build):
   | Key | Value | Obrigatório? |
   |-----|--------|--------------|
   | `NG_APP_API_URL` | `https://SEU-SERVICO.onrender.com` | **Sim** (URL absoluta do Render, sem `/` final) |

O script `scripts/set-env.mjs` grava `environment.production.ts` com essa URL no build.

### Teste

Abra `https://seu-app.vercel.app/tools/http-client`, marque **Usar proxy do backend**, envie um GET para `https://httpbin.org/get`.

### Local

```bash
# terminal 1
cd backend && dotnet run --project src/DevToolkit.API

# terminal 2
cd frontend && npm start
# proxy: /api e /health → localhost:5207
```

---

## 3. Checklist anti-erro

- [ ] Root Directory **frontend** na Vercel e **backend** no Render (monorepo)
- [ ] `NG_APP_API_URL` na Vercel aponta para a URL **HTTPS** do Render
- [ ] `CORS_ORIGINS` no Render inclui a URL exata da Vercel (com `https://`)
- [ ] Health do Render: `/health` retorna 200
- [ ] Node 22+ na Vercel (automático com package engines se quiser)
- [ ] .NET 10 no Docker do Render (imagem `mcr.microsoft.com/dotnet/...:10.0`)

---

## 4. Endpoints da API

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/` | Info do serviço |
| GET | `/health` | Health check |
| GET | `/api/health` | Health (controller) |
| POST | `/api/proxy` | Proxy HTTP (body: method, url, headers, body, timeoutMs) |

Exemplo proxy:

```json
{
  "method": "GET",
  "url": "https://httpbin.org/get",
  "headers": { "Accept": "application/json" },
  "timeoutMs": 15000
}
```

---

## 5. Docker Compose (local full stack)

```bash
# na raiz do monorepo
docker compose up --build
# frontend http://localhost:4200
# backend  http://localhost:5207
```
