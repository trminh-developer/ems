import express from 'express';
import { createHostedApp } from './src/hostedApp';

const app = express();
app.disable('x-powered-by');
app.use(createHostedApp());
export default app;
