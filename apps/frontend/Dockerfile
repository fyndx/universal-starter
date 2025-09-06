FROM oven/bun:latest AS base

ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}
# ENV NODE_ENV=${ENVIRONMENT}

WORKDIR /app
# Copy package files first for better caching
COPY package.json bun.lock ./
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/
RUN bun install

COPY . .

FROM base AS build

WORKDIR /app

RUN bun install --ignore-scripts
# Create web build
RUN cd apps/frontend && bunx run export:web
# Create server build
RUN cd apps/frontend && bun run expo:server

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/apps/frontend/dist ./dist
COPY --from=build /app/apps/frontend/server ./server

ENV NODE_ENV=production

CMD [ "./server" ]

EXPOSE 4000