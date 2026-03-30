import express from 'express';
import cors from 'cors';
import { initDb } from './db/schema';
import mealsRouter from './routes/meals';
import weightRouter from './routes/weight';
import goalsRouter from './routes/goals';
import statsRouter from './routes/stats';

const app = express();
app.use(cors());
app.use(express.json());

initDb();

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/meals', mealsRouter);
app.use('/api/weight', weightRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/stats', statsRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`CanMo server running on http://localhost:${PORT}`);
});
