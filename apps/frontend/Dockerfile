FROM gcr.io/distroless/base

WORKDIR /app

COPY ./apps/frontend/dist .
COPY ./apps/frontend/server .

ENV NODE_ENV=production

CMD [ "./server" ]

EXPOSE 4000