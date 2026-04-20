# BK Consultancy Monorepo

Production-ready split architecture:

- `app/` — Vite + React frontend (deploy to Vercel).
- `server/` — Express + MongoDB backend API (run separately).

## Quick Start

### Frontend
```bash
cd app
npm install --workspaces=false
npm run dev
```

### Backend
```bash
cd server
cp .env.example .env
npm install --workspaces=false
npm run dev
```

## Build Frontend
```bash
cd app
npm run build
```

## Vercel Deployment

### Recommended (Project Root = `app`)
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install --workspaces=false`

### Alternative (Project Root = repository root)
- Uses root `vercel.json`:
  - Build command: `cd app && npm install && npm run build`
  - Output: `app/dist`

## Environment Variables

Frontend (`app/.env`):
```env
VITE_API_BASE_URL=https://your-backend-url/api
```

Backend (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bk_consultancy
JWT_SECRET=replace_with_a_long_random_secret
CORS_ORIGIN=http://localhost:5173
```
