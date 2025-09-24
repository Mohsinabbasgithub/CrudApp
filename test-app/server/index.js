import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemsRouter from './routes/items.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/items', itemsRouter);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const payload = { error: 'Internal Server Error' };
  if (process.env.NODE_ENV !== 'production' && err && err.message) {
    payload.details = err.message;
  }
  res.status(err.status || 500).json(payload);
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
