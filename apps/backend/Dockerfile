FROM oven/bun AS build

WORKDIR /app

# Pass environment as build arg (default: production)
# available environments: production, development, staging
ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}

# Cache packages installation
# Copy workspace root files first
COPY package.json bun.lock ./
COPY packages/ ./packages/

# Copy app package.json files
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy backend app files
COPY apps/backend/src ./apps/backend/src
COPY apps/backend/prisma ./apps/backend/prisma
COPY apps/backend/tsconfig.json ./apps/backend/
# UNCOMMENT BELOW LINE WHEN .env.${ENVIRONMENT} FILE IS PRESENT
# COPY apps/backend/.env.${ENVIRONMENT} ./apps/backend/

# Change to backend directory for build
WORKDIR /app/apps/backend

ENV NODE_ENV=production

# Generate Prisma client
RUN bun prisma generate --no-engine

RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/apps/backend/server server
# Copy .env file to runtime image for Prisma
COPY --from=build /app/apps/backend/.env* ./

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000