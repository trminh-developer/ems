import { CorsOptions } from 'cors';

export function createCorsOptions(): CorsOptions {
  const allowedOrigins = new Set([
    'http://localhost:5173',
    'https://heartconnect-8e934.web.app',
    'https://heartconnect-8e934.firebaseapp.com',
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS || '').split(','),
  ].filter((value): value is string => !!value?.trim()).map(value => new URL(value.trim()).origin));

  return {
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      try {
        const url = new URL(origin);
        if (!['http:', 'https:'].includes(url.protocol)) return callback(null, false);
        const hostname = url.hostname;
        const local = ['localhost', '127.0.0.1', '[::1]'].includes(hostname) ||
          /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname);
        const hosted = ['.devtunnels.ms', '.ngrok-free.app', '.ngrok-free.dev', '.vercel.app', '.web.app', '.firebaseapp.com']
          .some(suffix => hostname.endsWith(suffix));
        return callback(null, local || hosted || process.env.NODE_ENV !== 'production');
      } catch {
        return callback(null, false);
      }
    },
  };
}
