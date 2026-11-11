import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import newsRoutes from './src/routes/newsRoutes.js';
import { startIngestionCron } from './src/services/newsIngestion.js';
import { errorHandler, notFoundHandler } from './src/utils/errorHandler.js';

const app = express();
const port = Number.parseInt(process.env.PORT, 10) || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/telangana_ap_news';

app.use(cors());
app.use(express.json());
app.get('/health', (request, response) => response.json({ status: 'ok' }));
app.use('/api', newsRoutes);

// Serve the built frontend (client/dist) when it exists; unknown non-API routes
// fall back to index.html so client-side routes work on reload.
const clientDist = path.join(path.dirname(fileURLToPath(import.meta.url)), 'client', 'dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^\/(?!api\/|health$).*/, (request, response) => response.sendFile(path.join(clientDist, 'index.html')));
}
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    startIngestionCron();
    app.listen(port, () => console.log(`News API listening on port ${port}`));
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exitCode = 1;
  }
}

async function shutdown(signal) {
  console.log(`${signal} received. Closing database connection...`);
  await mongoose.connection.close();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();

export default app;
