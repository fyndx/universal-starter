# 1. Base setup (dependencies only)
FROM oven/bun:debian AS base
# Install turbo globally
RUN bun install turbo --global

# Setup Phase
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune @universal/api --docker

FROM base AS installer
WORKDIR /app
# Install dependencies for the pruned monorepo
COPY --from=builder /app/out/json .
RUN bun install

# Build Phase
ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}
COPY --from=builder /app/out/full .
RUN mkdir -p ./apps/api/public
RUN turbo run build --filter=@universal/api

# Production image
FROM gcr.io/distroless/base
WORKDIR /app

# Copy built server and public assets
COPY --from=installer /app/apps/api/server server
COPY --from=installer /app/apps/api/.env* ./
COPY --from=installer /app/apps/api/public ./public

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000