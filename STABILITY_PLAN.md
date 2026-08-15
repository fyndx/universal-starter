# Universal Starter — Stability Roadmap

> Goal: make the starter feel as stable and production-ready as NestJS.
>
> NestJS's stability isn't from one feature — it's from the closed loop of
> **convention → generate → test → enforce in CI → document.** We have the
> convention (good stack choices) but the loop is open. This plan closes it.

---

## What "stable like NestJS" actually means

NestJS feels stable for four reasons, and the starter currently has only one
of them covered:

| Pillar                                  | NestJS          | Universal Starter (current)          |
| --------------------------------------- | --------------- | ------------------------------------ |
| 1. Strong conventions + scaffolding     | NestJS CLI      | **None**                             |
| 2. Batteries-included testing           | Jest + supertest| **Zero tests** (api `test` script echoes "no test specified") |
| 3. CI that enforces quality on every PR | Built-in        | Only Docker image builds; no lint/typecheck/test gates |
| 4. Predictable errors + observability   | Exception filters + Logger | OTel on API only; nothing on web; no error tracking |

The good news: the foundations (typed Elysia, Prisma, better-auth, turbo,
biome, OpenAPI) are solid. The work is mostly "wire it up and enforce it,"
not "rebuild."

---

## Tier 1 — The non-negotiables

Without these it never feels stable.

### 1. Testing infrastructure (biggest gap)

- [x] Add a `test` task to `turbo.json` and a test script to every app/package.
- [x] **API + workers**: Bun's built-in test runner (`bun test`) — zero config,
      already on Bun, faster than Jest. Add a test DB (separate
      `DATABASE_URL_TEST`) with per-test transaction rollback or a prisma
      reset helper. _(test runner done; test DB pending)_
- [x] **Web**: Vitest (unit/component) + Playwright (e2e). Playwright because
      it can hit the real Next server and exercise auth flows end-to-end.
      _(Vitest done; Playwright pending)_
- [ ] **Mobile**: Jest + React Native Testing Library (expo's preset).
- [x] Ship example tests next to each example screen/route so the pattern is
      obvious — a sign-up form test, an admin list-users test, a Prisma repo test.
      _(example tests added for api, workers, web; mobile pending)_
- [ ] Add coverage reporting (`bun test --coverage`, `vitest --coverage`) and a
      minimum threshold so it can't silently rot.

### 2. CI quality gates (only build images today)

- [x] Add `.github/workflows/ci.yml` that runs on every PR:
      `pnpm install → turbo run check-types test build`
- [ ] Use turbo's remote cache + a `--filter` so unchanged apps don't rebuild.
- [x] Cache pnpm store + turbo cache across runs. _(pnpm cache via setup-node; turbo local cache works)_
- [ ] Run Prisma migrations against a throwaway Postgres service container to
      prove migrations apply cleanly (catches drift before merge).
- [x] Only after all green should the existing `docker-build` workflow run.
      _(ci.yml runs before docker-build; both trigger on PR)_
- [x] Add a path-filter so the web app doesn't trigger api image builds (the
      `dorny/paths-filter` already used for images — extend it to the ci workflow).
      _(ci.yml uses `paths:` to skip unrelated changes)_

### 3. Pre-commit hooks (lefthook.yml is 100% commented-out examples)

- [x] Wire lefthook `pre-commit` to run: `biome check --write` on staged
      files, `turbo check-types --filter` (fast, cached), and block commits
      with `console.log`/secrets patterns. _(biome --write on staged files done)_
- [x] `pre-push`: run the full `turbo test` (cached, so it's fast).
- [x] This is the single highest-leverage "feels stable" change — it makes bad
      code un-committable instead of caught in CI 10 minutes later.

### 4. Error handling contract

- [x] **API**: enforce the existing response schema (`src/schemas/response.ts`)
      everywhere with an Elysia `.onError` global that always returns that
      shape. Right now error responses are ad-hoc per route.
- [x] **Web**: add Next.js `error.tsx` at each route group level
      (`/(marketing)`, `/(protected)`, `/auth`) so a thrown error never shows a
      raw stack. Zero error boundaries on web today.
- [ ] Add an error reporter abstraction (see observability below) so the same
      error is both logged and surfaced to Sentry/Axiom.

---

## Tier 2 — High-value (goes from "works" to "trusted")

### 5. End-to-end type safety (currently broken)

- [ ] The Eden treaty client can't import the `App` type because the API's
      `@src/*` path aliases + Bun-only code leak into the web type graph.
- [ ] Fix: export a clean `App` type from the api package via a dedicated
      `exports` entry that carries ONLY types (no runtime imports). Or generate
      an OpenAPI spec → types with `openapi-typescript` and consume that on web.
- [ ] Once fixed, wire the typed treaty client into web data fetching and
      delete the loose `any` cast in `apps/web/src/lib/api-client.ts`.

### 6. Authorization on the server

- [ ] Add Elysia guards/middleware that check `session.user.role` on every
      admin route — the admin plugin endpoints exist but there's no central
      RBAC middleware pattern; the web app guards client-side only (trivially
      bypassable).
- [x] Add Next.js `middleware.ts` for server-side auth redirects on web — the
      current `/home` and `/admin` guards are client-only, so they flash
      content before redirecting. A middleware that reads the session cookie
      and redirects before render is the "stable" behavior.
- [ ] Consider 2FA + session device management UI (session revoke already
      exists in admin — surface it to the user too).

### 7. Observability across all three apps

- [x] **API**: has OTel + Axiom. Add a `/health` and `/ready` endpoint
      (DB ping + redis ping) — required for Docker healthchecks and k8s probes.
      No healthcheck today. _(both /health and /ready added; Docker HEALTHCHECK
      added to api + web Dockerfiles)_
- [ ] **Web**: add a lightweight error tracker (Sentry's Next.js SDK, or
      Axiom's web logs via a fetch transport). Wrap `error.tsx` boundaries to
      report.
- [ ] **Mobile**: add the same error tracker + a crash reporter for native.
- [ ] Add structured request logging on web (Next.js middleware → Axiom) so a
      request can be traced across web → api → db.

### 8. Configuration & secrets management

- [ ] zod env validation exists in api and web — extend to ALL packages
      (db, redis, queue-kit) so a missing env fails fast with a clear message,
      not a runtime null-pointer.
- [ ] Add a `scripts/validate-env.ts` that checks all apps' `.env` against
      their schemas in CI (catches "forgot to add the new var" before deploy).
- [ ] Document a secret-management path: at minimum, a `.env.example` that's
      guaranteed in sync (a test that diffs `.env.example` keys against the
      zod schema). Right now `.env.example` is hand-maintained and will drift.

### 9. Database reliability

- [ ] Add `prisma migrate diff` / `prisma migrate status` to CI to catch
      migration drift and schema-vs-migration mismatch.
- [ ] Add a seed script that's idempotent and runs in CI against the test DB
      so the test suite has real-ish data.
- [ ] Consider a shared repository pattern so DB access isn't scattered raw
      prisma calls — NestJS's service/repository layer is part of why it
      feels structured.

---

## Tier 3 — Polish that makes it feel mature

### 10. Scaffolding / code generation (the NestJS CLI equivalent)

- [ ] Add plop or hygen templates:
      - `pnpm gen route`     → new Elysia route module + test
      - `pnpm gen web-page`  → new Next.js route + test
      - `pnpm gen component` → new shadcn component (or use `npx shadcn add`)
      - `pnpm gen model`     → new Prisma model + migration stub
- [ ] This is what makes devs productive in 5 minutes instead of 50.

### 11. Component documentation

- [ ] Add Storybook to the web app (and mobile via `@storybook/react-native`).
- [ ] Document every UI primitive with states + dark mode. NestJS's docs are a
      big part of its trust signal; for a UI-heavy starter, Storybook is ours.

### 12. Security hardening

- [ ] **Web**: add a security headers middleware (CSP, X-Frame-Options,
      Referrer-Policy) — Next.js makes this a one-file middleware. None today.
- [ ] Add `pnpm audit` / Dependabot or Renovate config to the repo.
- [ ] Add a secret-scanning pre-commit hook (gitleaks) so no `.env` leaks.
- [ ] **API**: rate limiting + CORS validation exist — verify the CORS
      allowlist is enforced in prod, not just dev.

### 13. Deployment & ops

- [x] Add `HEALTHCHECK` directives to every Dockerfile (api, workers, mobile
      web-server, web). Dockerfiles exist but no healthchecks.
      _(api: curl /api/health; web: wget /; workers: documented — distroless
      has no shell)_
- [ ] Add graceful shutdown to the API (Elysia `.onStop`) so containers drain
      in-flight requests.
- [ ] Add a `docker-compose.dev.yml` that's the "just works" full-stack local
      dev path (api + web + postgres + redis + workers) so a new dev runs ONE
      command. The compose files exist but are split (base/staging/prod).
- [ ] Add preview/deploy previews if possible (Vercel for web, EAS for mobile,
      fly/render for api) — PR previews are a huge stability signal.

### 14. Frontend UX stability

- [x] **Web**: add `loading.tsx` + `error.tsx` to every route segment (Next.js
      streaming). `LoadingScreen` exists but not the per-segment Suspense
      boundaries.
- [ ] Add a global `<Suspense>` + streaming pattern so pages don't blank.
- [ ] Add bundle analysis (`@next/bundle-analyzer`) so bundle size regressions
      are visible.
- [ ] **Mobile**: the skia-loader / splash pattern is good; document it.

### 15. Queue / worker reliability

- [ ] queue-kit + redis + workers app exist, but no dead-letter queue, retry
      policy, or job monitoring pattern documented.
- [ ] Add a job dashboard (BullMQ has one, or a simple admin page) so devs can
      see failed jobs — invisible background failures are the #1 "why did this
      stop working" in production.

### 16. Documentation

- [ ] Root README with architecture diagram, "how to run everything in 3
      commands," and a decision log (ADRs) for why Elysia over NestJS, why
      better-auth over rolling your own, etc. ADRs are how mature projects
      signal intent.
- [ ] Per-package README with purpose + public API.
- [ ] Serve the OpenAPI docs at a known URL (the `@elysiajs/openapi` plugin is
      installed — make sure `/api/reference` works in dev AND prod; currently
      unclear).

---

## Suggested order of attack

Sequenced for maximum "feels stable" per hour:

- **Phase 1 (1–2 days)** — lefthook hooks + CI quality gate + turbo `test`
  task + one example test per app. Instantly stops regressions and makes the
  repo feel professional on the first `git commit`.

- **Phase 2 (2–3 days)** — error boundaries (web) + API error contract +
  `/health` endpoints + Docker healthchecks. "It doesn't crash silently" is
  the core of stability.

- **Phase 3 (2–3 days)** — server-side auth guards (Elysia RBAC middleware +
  Next.js middleware) + typed treaty client fix + env validation across
  packages. "It's secure and types flow end-to-end."

- **Phase 4 (ongoing)** — scaffolding templates, Storybook, ADRs, security
  headers, queue dashboard. The polish that turns "stable" into "I'd pay for
  this."

---

## The one-line takeaway

> NestJS's stability isn't from one feature — it's from the closed loop of
> **convention → generate → test → enforce in CI → document.** Close that loop
> and the starter will feel every bit as solid.
