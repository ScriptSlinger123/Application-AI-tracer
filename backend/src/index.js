import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './Middleware/errorHandler.js';
import { isSupabaseConfigured } from './Config/SupabaseConfig.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    name: 'Job Application Tracer API',
    docs: '/api/health',
    supabaseConfigured: isSupabaseConfigured(),
  });
});

app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET not set — auth will fail');
  }
  if (!process.env.OPENAI_API_KEY) {
    console.log('OPENAI_API_KEY not set — AI endpoints use demo/mock responses');
  }
});
