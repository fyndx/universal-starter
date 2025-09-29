FROM oven/bun:debian AS base
# Install turbo globally
RUN bun install turbo --global

# Setup Phase
FROM base as builder
WORKDIR /app
COPY . .
RUN turbo prune @universal/workers --docker

FROM base AS installer
WORKDIR /app
# Install dependencies for the pruned monorepo
COPY --from=builder /app/out/json .
RUN bun install

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