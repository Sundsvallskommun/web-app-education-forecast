# Resultatprognoser

## APIer som används

Dessa APIer används i projektet, applikationsanvändaren i WSO2 måste prenumerera på dessa.

| API             | Version |
| --------------- | ------: |
| simulatorserver |     2.0 |
| education       |     2.0 |
| pupilforecast   |     1.0 |
| employee        |     2.0 |

## Utveckling

### Krav

- Node >= 20 LTS
- Yarn

### Steg för steg

1. Klona ner repot

```
git clone https://github.com/Sundsvallskommun/web-app-education-forecast
```

2. Installera dependencies för både `backend` och `frontend`

```
cd frontend
yarn install

cd backend
yarn install
```

3. Skapa .env-fil för `frontend`

```
cd frontend
cp .env-example .env
```

Redigera `.env` för behov, för utveckling bör exempelvärdet fungera.

4. Skapa .env-fil för `backend`

```
cd backend
cp .env.example.local .env.development.local
cp .env.example.local .env.test.local
```

eventuellt redigera `.env.development.local` för behov. URLer, nycklar och cert behöver fyllas i korrekt.

- `CLIENT_KEY` och `CLIENT_SECRET` måste fyllas i för att APIerna ska fungera, du måste ha en applikation från WSO2-portalen som abonnerar på de microtjänster du anropar
- `SAML_ENTRY_SSO` behöver pekas till en SAML IDP
- `SAML_IDP_PUBLIC_CERT` ska stämma överens med IDPens cert
- `SAML_PRIVATE_KEY` och `SAML_PUBLIC_KEY` behöver bara fyllas i korrekt om man kör mot en riktig IDP

### Session-hantering (Memory / File / Redis)

Backend använder `express-session` för sessionshantering. Session store väljs via miljövariabeln `SESSION_STORE`.

| Värde    | Beskrivning                          | Rekommenderad miljö   |
| -------- | ------------------------------------ | --------------------- |
| `memory` | In-memory store (default)            | Lokal utveckling      |
| `file`   | Filbaserad store (`./data/sessions`) | Lokal test / legacy   |
| `redis`  | Redis-baserad store                  | OpenShift / multi-pod |

I OpenShift används Redis för sessioner, vilket gör backend stateless så att flera poddar kan köras. I produktion med Redis delas även OAuth-token mot API-gatewayn mellan poddarna via Redis (`src/services/api-token-service/redis-api-token.service.ts`).

Följande miljövariabler sätts via Deployment / Helm / ArgoCD:

```
SESSION_STORE=redis
REDIS_HOST=<redis-hostname>
REDIS_PORT=6379
REDIS_PASSWORD=<secret>
```

Redis initieras endast när `SESSION_STORE=redis` (`src/utils/initRedis.ts`). Saknas `REDIS_HOST` när Redis är vald kraschar applikationen direkt vid start med:

```
Failed to start app: Error: SESSION_STORE=redis but REDIS_HOST is not set
```

Lokal utveckling kräver ingen Redis, samma kodbas används i alla miljöer.

### Liveness-routes

Backend svarar på `GET /health` (utan `BASE_URL_PREFIX`) och frontend på `GET /api/health` med `{ "status": "OK" }` utan att anropa några beroenden. Dessa används som liveness-probes i OpenShift. `GET /api/health/up` i frontend anropar backend via `INTERNAL_API_URL` och kontrollerar hela kedjan.
