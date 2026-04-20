# Production Rebuild Report

## 1) What was broken

- Frontend configuration existed in `app/`, but `package.json` lived at repo root, causing split/inconsistent build context.
- Root and app Vercel configs were inconsistent.
- App used an unnecessary custom Vite plugin (`kimi-plugin-inspect-react`) that added instability.
- `app/dist` build artifacts were committed.
- `server/.env` existed in repository (secret handling risk).
- Backend content write endpoints were unauthenticated.
- Backend CORS policy was unrestricted.
- Frontend admin API calls were hardcoded to localhost URLs.
- `components.json` pointed Tailwind config to the wrong file.

## 2) What was fixed

- Converted repository into a clean monorepo structure:
  - root orchestrator `package.json` with workspace scripts.
  - dedicated `app/package.json` for frontend.
  - existing `server/package.json` preserved for backend.
- Normalized Vite setup in `app/vite.config.ts`:
  - removed custom inspect plugin.
  - kept only stable React plugin + alias.
- Standardized Vercel configuration:
  - `app/vercel.json` for direct frontend deployment.
  - root `vercel.json` for optional monorepo root deployment.
- Added `.gitignore` for dependencies, dist, env files, and editor noise.
- Removed committed `server/.env` and added `server/.env.example`.
- Added shared frontend API base config (`app/src/config.ts`) and replaced hardcoded localhost endpoints in admin dashboard.
- Hardened backend:
  - extracted JWT middleware to `server/middleware/authenticateAdmin.js`.
  - protected all `POST /api/content/*` routes.
  - added input checks and try/catch in admin auth routes.
  - restricted CORS via `CORS_ORIGIN` env var.
  - added `/api/health` endpoint.
- Fixed shadcn config pointer in `app/components.json`.

## 3) Final folder structure

- `package.json` (workspace orchestration)
- `.gitignore`
- `vercel.json` (root-level option)
- `app/` (Vite frontend)
  - `package.json`
  - `vite.config.ts`
  - `tailwind.config.js`
  - `postcss.config.js`
  - `src/`
  - `vercel.json`
- `server/` (Express backend)
  - `index.js`
  - `middleware/authenticateAdmin.js`
  - `routes/`
  - `models/`
  - `.env.example`

## 4) Commands to run locally

Frontend:
```bash
cd app
npm install --workspaces=false
npm run dev
npm run build
```

Backend:
```bash
cd server
cp .env.example .env
npm install --workspaces=false
npm run dev
```

## 5) Vercel settings

Recommended:
- Root Directory: `app`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install --workspaces=false`

## 6) Remaining risks / manual steps

- In this execution environment, npm registry policy blocks some optional packages (notably `@rollup/rollup-linux-x64-gnu`), which can prevent local Vite dev/build from running here.
- In normal CI/Vercel/public npm environments, running a clean install in `app/` should resolve this optional dependency automatically.
- Rotate any secrets that might previously have been present in committed `server/.env`.
