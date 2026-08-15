# ── Base: Node + pnpm + turbo ──────────────────────────────────────────────
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10.23.0 --activate
RUN npm install -g turbo

# ── Builder: prune the monorepo to only what @universal/web needs ──────────
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune @universal/web --docker

# ── Installer: install deps + build ────────────────────────────────────────
FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json .
RUN pnpm install --frozen-lockfile

# NEXT_PUBLIC_* vars are inlined at build time, so they must be present
# before `next build`.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=builder /app/out/full .
RUN turbo run build --filter=@universal/web

# ── Runner: minimal Node image with only the standalone server ─────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Next.js standalone server reads these to bind its listener.
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as a non-root user.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# The standalone build preserves the monorepo directory structure, so the
# server entry lives at apps/web/server.js and static assets at
# apps/web/.next/static.
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["wget", "-qO-", "http://localhost:3000/"]
