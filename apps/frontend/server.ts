import path from "node:path";
// import { createRequestHandler } from "@expo/server";
import { createRequestHandler } from "@expo/server/adapter/bun";
import Bun from "bun";

const handler = createRequestHandler({
  build: path.join(path.dirname(import.meta.path), "dist/server"),
});

const server = Bun.serve({
  port: 4000,
  routes: {
    "/_expo/static/*": async (request) => {
      const file = Bun.file(`./dist/client/${new URL(request.url).pathname}`);
      const exists = await file.exists();
      return exists
        ? new Response(file)
        : new Response("Not found", { status: 404 });
    },
    "/assets/*": async (request) => {
      const file = Bun.file(`./dist/client/${new URL(request.url).pathname}`);
      const exists = await file.exists();
      return exists
        ? new Response(file)
        : new Response("Not found", { status: 404 });
    },
    "/*": async (request) => await handler(request),
    "/canvaskit.wasm": async (_request) => {
      const file = Bun.file("./dist/client/canvaskit.wasm");
      const exists = await file.exists();
      return exists
        ? new Response(file)
        : new Response("Not found here", { status: 404 });
    },
  },
});

// biome-ignore lint/suspicious/noConsole: logging the server URL
console.log(`Server listening on ${server.url}`);
