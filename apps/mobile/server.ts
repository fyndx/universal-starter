// import path from "node:path";
// import { createRequestHandler } from "@expo/server";
import { createRequestHandler } from "@expo/server/adapter/bun";
import Bun from "bun";

// const CLIENT_BUILD_DIR = `${process.cwd()}/dist/client`;
const SERVER_BUILD_DIR = `${process.cwd()}/dist/server`;

const handler = createRequestHandler({
  build: SERVER_BUILD_DIR,
});

async function serveStaticFile(pathname: string): Promise<Response> {
  const file = Bun.file(`./dist/client/${pathname}`);
  const exists = await file.exists();
  return exists
    ? new Response(file)
    : new Response("Not found", { status: 404 });
}

const server = Bun.serve({
  port: 4000,
  routes: {
    "/_expo/static/*": async (request) => {
      const pathname = new URL(request.url).pathname;
      return await serveStaticFile(pathname);
    },
    "/assets/*": async (request) => {
      const pathname = new URL(request.url).pathname;
      return await serveStaticFile(pathname);
    },
    "/canvaskit.wasm": async (_request) => {
      return await serveStaticFile("canvaskit.wasm");
    },
    "/*": async (request) => await handler(request),
  },
});

// biome-ignore lint/suspicious/noConsole: logging the server URL
console.log(`Server listening on ${server.url}`);
