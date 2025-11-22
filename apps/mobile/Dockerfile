FROM oven/bun:debian AS base 
# Setup: Install turbo globally
RUN bun install turbo --global 

# Setup Phase 
FROM base as builder
RUN apt-get update && \ 
    apt-get install -y watchman && \ 
    apt-get clean && \ 
    rm -rf /var/lib/apt/lists/* 
# Setup: Install turbo globally 
WORKDIR /app 
# Install Phase 
COPY . . 
RUN turbo prune @universal/mobile --docker 
FROM base AS installer 
WORKDIR /app 
# Install dependencies for the full monorepo 
COPY --from=builder /app/out/json . 
RUN bun install 
# Build Phase
ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL
COPY --from=builder /app/out/full . 
RUN turbo run build --filter=@universal/mobile
# Production image 
# For Web 
FROM gcr.io/distroless/base AS web 
WORKDIR /app 
ENV NODE_ENV=production 
COPY --from=installer /app/apps/mobile/web-server /app/server 
COPY --from=installer /app/apps/mobile/dist /app/dist 
CMD [ "./server" ] 
EXPOSE 4000