import { Router } from 'express';
import db from '../db/connection';
import { Meal, Goal, DailyStats, WeeklyDay } from '../types';

const router = Router();

// GET /api/stats/daily?date=YYYY-MM-DD
router.get('/daily', (req, res) => {
  const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
  const meals = db.prepare('SELECT * FROM meals WHERE date = ? ORDER BY created_at DESC').all(date) as Meal[];
  const goal = db.prepare('SELECT * FROM goals ORDER BY id DESC LIMIT 1').get() as Goal;

  const totalCalories = meals.reduce((sum, m) => sum + Math.round(m.calories * m.quantity), 0);
  const targetCalories = goal.daily_calories;

  const stats: DailyStats = {
    date,
    totalCalories,
    targetCalories,
    remaining: targetCalories - totalCalories,
    meals,
  };

  res.json(stats);
});

// GET /api/stats/weekly
router.get('/weekly', (_req, res) => {
  const goal = db.prepare('SELECT * FROM goals ORDER BY id DESC LIMIT 1').get() as Goal;
  const days: WeeklyDay[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);

    const meals = db.prepare('SELECT * FROM meals WHERE date = ?').all(date) as Meal[];
    const totalCalories = meals.reduce((sum, m) => sum + Math.round(m.calories * m.quantity), 0);

    days.push({
      date,
      totalCalories,
      targetCalories: goal.daily_calories,
    });
  }

  res.json({ days });
});

export default router;
