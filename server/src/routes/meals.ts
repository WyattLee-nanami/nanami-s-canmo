import { Router } from 'express';
import db from '../db/connection';
import { Meal } from '../types';

const router = Router();

// GET /api/meals/daily?date=YYYY-MM-DD
router.get('/daily', (req, res) => {
  const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
  const meals = db.prepare('SELECT * FROM meals WHERE date = ? ORDER BY created_at DESC').all(date) as Meal[];
  const totalCalories = meals.reduce((sum, m) => sum + m.calories * m.quantity, 0);
  res.json({ date, meals, totalCalories });
});

// GET /api/meals
router.get('/', (req, res) => {
  const date = req.query.date as string | undefined;
  let meals: Meal[];
  if (date) {
    meals = db.prepare('SELECT * FROM meals WHERE date = ? ORDER BY created_at DESC').all(date) as Meal[];
  } else {
    meals = db.prepare('SELECT * FROM meals ORDER BY date DESC, created_at DESC LIMIT 100').all() as Meal[];
  }
  res.json({ meals });
});

// POST /api/meals
router.post('/', (req, res) => {
  const { food_name, calories, quantity = 1, unit = '份', meal_type = 'other', date } = req.body;

  if (!food_name || calories == null) {
    res.status(400).json({ error: '食物名称和卡路里为必填项' });
    return;
  }

  const mealDate = date || new Date().toISOString().slice(0, 10);
  const result = db.prepare(
    'INSERT INTO meals (food_name, calories, quantity, unit, meal_type, date) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(food_name, calories, quantity, unit, meal_type, mealDate);

  const meal = db.prepare('SELECT * FROM meals WHERE id = ?').get(result.lastInsertRowid) as Meal;
  res.status(201).json({ meal });
});

// DELETE /api/meals/:id
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM meals WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: '记录不存在' });
    return;
  }
  res.json({ success: true });
});

export default router;
