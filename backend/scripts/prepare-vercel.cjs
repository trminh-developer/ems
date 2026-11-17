const fs = require('node:fs');
const path = require('node:path');
const source = require('swagger-ui-dist').getAbsoluteFSPath();
const target = path.resolve(__dirname, '../public/docs/assets');
fs.mkdirSync(target, { recursive: true });
for (const name of ['swagger-ui.css', 'swagger-ui-bundle.js', 'favicon-32x32.png']) {
  fs.copyFileSync(path.join(source, name), path.join(target, name));
}
console.log('Prepared Swagger assets for the Vercel CDN.');
