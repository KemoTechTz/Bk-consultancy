# Code Review Summary

Date: 2026-04-19

## Scope Reviewed
- Backend API (`server/index.js`, `server/routes/*.js`, `server/models/*.js`)
- Frontend admin API usage (`app/src/api.js`, `app/src/sections/portal/AdminDashboard.tsx`)

## High-Priority Findings

1. **Unauthenticated content writes (Critical)**
   - `POST /api/content/projects`, `POST /api/content/blogs`, `POST /api/content/testimonials`, and `POST /api/content/services` are publicly writable.
   - This allows any unauthenticated user to create records.
   - Recommendation: reuse JWT middleware from `admin.js` and require authentication for write operations.

2. **Overly permissive CORS (High)**
   - Server currently uses `app.use(cors())` with no origin restrictions.
   - Recommendation: restrict origins via environment configuration and allow only required methods/headers.

3. **Sensitive `.env` file appears committed (High)**
   - Repository includes `server/.env`.
   - Recommendation: remove committed secrets, rotate any exposed credentials, and add `.env` to `.gitignore`.

## Medium-Priority Findings

4. **Minimal request validation (Medium)**
   - Models mostly define fields without `required`, length constraints, or validation rules.
   - Recommendation: enforce schema validation (required fields, enum constraints where relevant, trimming/sanitization).

5. **Inconsistent API client usage on frontend (Medium)**
   - `app/src/api.js` defines Axios instance, while admin portal uses hard-coded `fetch` URLs.
   - Recommendation: centralize API calls through a single client, preferably with token injection and common error handling.

6. **Missing defensive error handling in auth routes (Medium)**
   - `/api/admin/login` and `/api/admin/register` do not wrap database/hash operations in `try/catch`.
   - Recommendation: add structured error handling and consistent status codes.

## Low-Priority Observations

7. **Deprecated Mongoose connection options (Low)**
   - `useNewUrlParser` and `useUnifiedTopology` are legacy/no-op in modern Mongoose versions.
   - Recommendation: remove deprecated options to reduce noise and future warnings.

8. **No explicit rate limiting for auth/content endpoints (Low/Defense-in-depth)**
   - Recommendation: apply `express-rate-limit` to login and mutation endpoints.

## Suggested Remediation Order
1. Protect write endpoints with JWT.
2. Remove exposed secrets and rotate credentials.
3. Lock down CORS.
4. Add validation + standardized error handling.
5. Consolidate frontend API client usage.
