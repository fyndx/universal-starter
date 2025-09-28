FROM ubuntu:latest AS base

# Setup phase
RUN apt-get update && \
    apt-get install -y curl gnupg ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm bun && \
    apt-get install -y watchman && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# install phase
COPY . .
RUN pnpm install --prefer-frozen-lockfile

# build phase
RUN cd apps/frontend && pnpm run export:web && pnpm run export:server

# runtime image
FROM gcr.io/distroless/base
# FROM ubuntu:latest
WORKDIR /app

COPY --from=base /app/apps/frontend/web-server /app/server
COPY --from=base /app/apps/frontend/dist/ /app/dist/

ENV NODE_ENV=production
CMD ["./server"]
# ENTRYPOINT [ "sh" ]
EXPOSE 3000