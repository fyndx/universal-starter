# 1. Base setup (dependencies only)
FROM oven/bun AS base
# Pass environment as build arg (default: production)
# available environments: production, development, staging
ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}
# ENV NODE_ENV=production

WORKDIR /app
# Copy package files first for better caching
COPY . .

# Install dependencies (this layer will be cached if package files don't change)
RUN bun install --ignore-scripts

RUN cd apps/frontend && \
    bun install 

RUN cd apps/frontend && \
    bunx expo export --platform web
RUN cd apps/frontend && \
    bun run export:server


FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=base ./apps/frontend/dist .
COPY --from=base ./apps/frontend/server .

ENV NODE_ENV=production

CMD [ "./server" ]

EXPOSE 4000