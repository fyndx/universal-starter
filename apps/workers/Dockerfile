FROM oven/bun AS base

ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}
# ENV NODE_ENV=production

WORKDIR /app

COPY bun.lock package.json ./
COPY packages/ ./packages/
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/

RUN bun install

FROM base AS build
WORKDIR /app

COPY . .

RUN bun install --ignore-scripts

RUN bun run --filter @universal/workers build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --target bun \
  --outfile workers \
  ./src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/apps/workers/workers workers
# Copy .env file to runtime image for Prisma
COPY --from=build /app/apps/workers/.env* ./

ENV NODE_ENV=production
CMD [ "./workers" ]