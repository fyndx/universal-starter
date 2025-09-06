FROM oven/bun:latest AS base

WORKDIR /app

COPY ./apps/frontend/dist ./dist
COPY ./apps/frontend/server ./server

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=base /app/apps/frontend/dist ./dist
COPY --from=base /app/apps/frontend/server ./server

ENV NODE_ENV=production

CMD [ "./server" ]

EXPOSE 4000