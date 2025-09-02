# 1. Base setup (dependencies only)
FROM oven/bun AS base
# Pass environment as build arg (default: production)
# available environments: production, development, staging
ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}
# ENV NODE_ENV=production

WORKDIR /app

COPY bun.lock package.json ./
COPY packages/ ./packages/
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/

RUN bun install --frozen-lockfile

# ------------------------
# 2. Install & Build API
# ------------------------
FROM base AS build
WORKDIR /app

COPY . .

# install again to ensure local packages are linked
RUN bun install --frozen-lockfile
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

# copy deps + shared packages (needed at runtime)
# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/packages ./packages
# COPY --from=build /app/bun.lock ./bun.lock
# COPY --from=build /app/package.json ./package.json

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000