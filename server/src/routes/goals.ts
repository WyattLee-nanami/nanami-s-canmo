import { Router } from 'express';
import db from '../db/connection';
import { Goal } from '../types';

const router = Router();

// GET /api/goals
router.get('/', (_req, res) => {
  const goal = db.prepare('SELECT * FROM goals ORDER BY id DESC LIMIT 1').get() as Goal;
  res.json({ goal });
});

// PUT /api/goals
router.put('/', (req, res) => {
  const { daily_calories } = req.body;

  if (daily_calories == null || daily_calories < 0) {
    res.status(400).json({ error: '请输入有效的每日卡路里目标' });
    return;
  }

  db.prepare(
    `UPDATE goals SET daily_calories = ?, updated_at = datetime('now', 'localtime') WHERE id = (SELECT id FROM goals ORDER BY id DESC LIMIT 1)`
  ).run(daily_calories);

  const goal = db.prepare('SELECT * FROM goals ORDER BY id DESC LIMIT 1').get() as Goal;
  res.json({ goal });
});

export default router;
