# 1. Base setup (dependencies only)
FROM oven/bun:debian AS base
# Install nodejs, npm and pnpm
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm turbo

# Setup Phase
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune @universal/api --docker

FROM base AS installer
WORKDIR /app
# Install dependencies for the pruned monorepo
COPY --from=builder /app/out/json .
RUN pnpm install --frozen-lockfile

# Build Phase
ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}
COPY --from=builder /app/out/full .
RUN mkdir -p ./apps/api/public
RUN turbo run build --filter=@universal/api

# Production image
FROM gcr.io/distroless/base
WORKDIR /app

# Copy curl from the builder stage for the Docker HEALTHCHECK.
# distroless has no shell or package manager, so we bring the binary in.
COPY --from=installer /usr/bin/curl /usr/bin/curl

# Copy built server and public assets
COPY --from=installer /app/apps/api/server server
COPY --from=installer /app/apps/api/.env* ./
COPY --from=installer /app/apps/api/public ./public

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["/usr/bin/curl", "-sf", "http://localhost:3000/api/health"]