// import { logger } from '@bogeychan/elysia-logger';
import cors from '@elysiajs/cors';
import { serverTiming } from '@elysiajs/server-timing';
import { staticPlugin } from '@elysiajs/static';
import swagger from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import logixlysia from 'logixlysia';
import { auth } from '@/src/lib/auth';
import { validateOrigin } from './cors';
import { instrumentation } from './lib/instrumentation';
import { OpenAPI } from './lib/open-api';
import { meRoutes } from './modules/me';

const PORT = 3000;

const app = new Elysia({ prefix: '/api' })
  // Core
  // TODO: Decide logixlysia or logger later
  // .use(
  //   logger({
  //     transport: {
  //       targets: [
  //         {
  //           target: 'pino-pretty',
  //           options: {
  //             colorize: true,
  //           },
  //         },
  //       ],
  //     },
  //   })
  // )
  .use(logixlysia())
  .use(instrumentation)
  .use(
    swagger({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
        tags: [{ name: 'App', description: 'General endpoints' }],
      },
    })
  )
  .use(serverTiming())
  .use(staticPlugin())
  .use(
    cors({
      origin: (request: Request) => {
        // const ALLOWED_ORIGINS = [
        // 	"http://localhost:8081",
        // 	// /^https:\/\/.*\.expo\.app$/,
        // 	"https://*.expo.app",
        // ];

        const origin = request.headers.get('origin') || '';
        return validateOrigin(origin);
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .mount(auth.handler)
  .get('/', () => 'Hello Elysia', {
    detail: {
      tags: ['App'],
    },
  })
  .get(
    '/health',
    () => {
      return {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
      };
    },
    {
      detail: {
        tags: ['App'],
        description: 'Health check endpoint',
        summary: 'Health Check',
      },
    }
  )
  .use(meRoutes())
  .listen(PORT);

export type App = typeof app;
