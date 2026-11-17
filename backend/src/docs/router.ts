import express, { Router } from 'express';
import helmet from 'helmet';
import { openApiDocument } from './openapi';

const swaggerAssets: string = require('swagger-ui-dist').getAbsoluteFSPath();
const html = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>HeartConnect API · Swagger UI</title>
  <link rel="icon" type="image/png" href="/docs/assets/favicon-32x32.png">
  <link rel="stylesheet" href="/docs/assets/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="/docs/assets/swagger-ui-bundle.js"></script>
  <script src="/docs/swagger-initializer.js"></script>
</body>
</html>`;

const initializer = `window.ui = SwaggerUIBundle({
  url: '/openapi.json',
  dom_id: '#swagger-ui',
  deepLinking: true,
  filter: true,
  displayRequestDuration: true,
  withCredentials: true,
  persistAuthorization: false,
  validatorUrl: null,
  docExpansion: 'list',
  defaultModelsExpandDepth: -1
});`;

export function createDocsRouter() {
  const router = Router();
  router.get('/openapi.json', (_req, res) => { res.json(openApiDocument); });
  // Use local scripts with Helmet's CSP; localhost must keep using HTTP for assets.
  router.get(['/docs', '/docs/'], helmet.contentSecurityPolicy({ directives: { 'upgrade-insecure-requests': null } }), (_req, res) => {
    res.type('html').send(html);
  });
  router.get('/docs/swagger-initializer.js', (_req, res) => { res.type('js').send(initializer); });
  router.use('/docs/assets', express.static(swaggerAssets, { index: false }));
  return router;
}
