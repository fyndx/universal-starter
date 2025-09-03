# 1. Base setup (dependencies only)
FROM oven/bun AS base
# Pass environment as build arg (default: production)
# available environments: production, development, staging
ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}
# ENV NODE_ENV=production

WORKDIR /app
# Copy package files first for better caching
COPY bun.lock package.json ./
COPY packages/ ./packages/
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/
# Install dependencies (this layer will be cached if package files don't change)
RUN bun install

# Bring in sources after deps cache is established
COPY . .

# ------------------------
# 2. Install & Build API
# ------------------------
FROM base AS build
WORKDIR /app

# for serving static files
# right now no static files to copy, so creating dir
RUN mkdir -p ./apps/api/public

# install again to ensure local packages are linked
RUN bun install --ignore-scripts
# Generate Prisma client
RUN bun --filter './packages/db' db:generate --no-engine

# build API app
RUN bun run --filter @universal/api build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/apps/api/server server
# Copy .env file to runtime image for Prisma
COPY --from=build /app/apps/api/.env* ./
# Copy public directory to runtime image
COPY --from=build /app/apps/api/public ./public

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000