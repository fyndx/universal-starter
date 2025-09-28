FROM oven/bun:debian AS base 

# Setup Phase 
FROM base as builder
RUN apt-get update && \ 
    apt-get install -y watchman && \ 
    apt-get clean && \ 
    rm -rf /var/lib/apt/lists/* 
# Setup: Install turbo globally 
RUN bun install turbo --global 
WORKDIR /app 
# Install Phase 
COPY . . 
RUN turbo prune @universal/app --docker 
FROM base AS installer 
RUN bun install turbo --global 
WORKDIR /app 
# Install dependencies for the full monorepo 
COPY --from=builder /app/out/json . 
RUN bun install 
# Build Phase 
COPY --from=builder /app/out/full . 
RUN turbo run build 
# Production image 
# For Web 
FROM gcr.io/distroless/base AS web 
WORKDIR /app 
ENV NODE_ENV=production 
COPY --from=installer /app/apps/frontend/web-server /app/server 
COPY --from=installer /app/apps/frontend/dist /app/dist 
CMD [ "./server" ] 
EXPOSE 4000