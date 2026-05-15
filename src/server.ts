import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
const apiProxyTarget = process.env['API_PROXY_TARGET'] || process.env['BACKEND_URL'] || 'http://localhost:3000';

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Proxy API requests to the backend service.
 */
app.use('/api', async (req, res) => {
  try {
    const targetUrl = new URL(req.originalUrl, apiProxyTarget).toString();
    const headers = new Headers();

    Object.entries(req.headers).forEach(([key, value]) => {
      if (!value || key.toLowerCase() === 'host' || key.toLowerCase() === 'content-length') {
        return;
      }

      headers.set(key, Array.isArray(value) ? value.join(',') : value);
    });

    const method = req.method.toUpperCase();
    const requestInit: RequestInit & { duplex?: 'half' } = {
      method,
      headers,
    };

    if (method !== 'GET' && method !== 'HEAD') {
      requestInit.body = Readable.toWeb(req) as ReadableStream;
      requestInit.duplex = 'half';
    }

    const backendResponse = await fetch(targetUrl, requestInit);

    res.status(backendResponse.status);
    backendResponse.headers.forEach((value, key) => {
      const normalized = key.toLowerCase();
      // Avoid forwarding hop-by-hop/encoding headers that can break browser decoding.
      if (
        normalized === 'content-encoding' ||
        normalized === 'content-length' ||
        normalized === 'transfer-encoding' ||
        normalized === 'connection'
      ) {
        return;
      }

      res.setHeader(key, value);
    });

    if (!backendResponse.body) {
      res.end();
      return;
    }

    Readable.fromWeb(backendResponse.body as any).pipe(res);
  } catch (error) {
    console.error('Error proxying API request:', error);
    res.status(502).json({ error: 'No fue posible conectar con el backend' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
