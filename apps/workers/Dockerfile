FROM oven/bun:debian AS base
# Install nodejs, npm and pnpm
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm turbo

# Setup Phase
FROM base as builder
WORKDIR /app
COPY . .
RUN turbo prune @universal/workers --docker

FROM base AS installer
WORKDIR /app
# Install dependencies for the pruned monorepo
COPY --from=builder /app/out/json .
RUN pnpm install --frozen-lockfile

# Build Phase
ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}
COPY --from=builder /app/out/full .
RUN turbo run build --filter=@universal/workers

# Production image
FROM gcr.io/distroless/base
WORKDIR /app

COPY --from=installer /app/apps/workers/worker worker
COPY --from=installer /app/apps/workers/.env* ./

ENV NODE_ENV=production

CMD ["./worker"]

# Workers use distroless (no shell/curl). Health monitoring is done via
# the orchestrator (Docker Compose restart policy, k8s liveness probes)
# or by checking the worker's Redis connection from a sidecar.