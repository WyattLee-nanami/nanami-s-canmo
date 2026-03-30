import { Router } from 'express';
import db from '../db/connection';
import { WeightRecord } from '../types';

const router = Router();

// GET /api/weight
router.get('/', (_req, res) => {
  const records = db.prepare('SELECT * FROM weight_records ORDER BY date ASC').all() as WeightRecord[];
  res.json({ records });
});

// POST /api/weight (upsert by date)
router.post('/', (req, res) => {
  const { weight, date } = req.body;

  if (weight == null) {
    res.status(400).json({ error: '体重为必填项' });
    return;
  }

  const recordDate = date || new Date().toISOString().slice(0, 10);

  db.prepare(
    `INSERT INTO weight_records (weight, date) VALUES (?, ?)
     ON CONFLICT(date) DO UPDATE SET weight = excluded.weight, created_at = datetime('now', 'localtime')`
  ).run(weight, recordDate);

  const record = db.prepare('SELECT * FROM weight_records WHERE date = ?').get(recordDate) as WeightRecord;
  res.status(201).json({ record });
});

export default router;
