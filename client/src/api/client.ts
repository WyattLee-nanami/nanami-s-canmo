import type { Meal, WeightRecord, Goal, DailyStats, WeeklyDay } from '../types';
import { supabase } from '../lib/supabase';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function requireAuthUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const userId = data.user?.id;
  if (!userId) throw new Error('未登录');
  return userId;
}

export const mealsApi = {
  getDaily: async (date: string) => {
    const day = date || todayStr();
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('date', day)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    const meals = (data ?? []) as Meal[];
    const totalCalories = meals.reduce((sum, m) => sum + m.calories * m.quantity, 0);
    return { date: day, meals, totalCalories };
  },
  create: async (meal: {
    food_name: string;
    calories: number;
    quantity?: number;
    unit?: string;
    meal_type?: string;
    date?: string;
  }) => {
    const insertRow = {
      food_name: meal.food_name,
      calories: meal.calories,
      quantity: meal.quantity ?? 1,
      unit: meal.unit ?? '份',
      meal_type: meal.meal_type ?? 'other',
      date: meal.date ?? todayStr(),
    };
    const { data, error } = await supabase.from('meals').insert(insertRow).select('*').single();
    if (error) throw new Error(error.message);
    return { meal: data as Meal };
  },
  remove: async (id: number) => {
    const { error } = await supabase.from('meals').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },
};

export const weightApi = {
  getAll: async () => {
    const { data, error } = await supabase.from('weight_records').select('*').order('date', { ascending: true });
    if (error) throw new Error(error.message);
    return { records: (data ?? []) as WeightRecord[] };
  },
  create: async (weight: number, date?: string) => {
    const userId = await requireAuthUserId();
    const recordDate = date ?? todayStr();
    const { data, error } = await supabase
      .from('weight_records')
      .upsert({ user_id: userId, weight, date: recordDate }, { onConflict: 'user_id,date' })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return { record: data as WeightRecord };
  },
};

export const goalsApi = {
  get: async () => {
    const userId = await requireAuthUserId();
    const { data, error } = await supabase.from('goals').select('*').limit(1).maybeSingle();
    if (error) throw new Error(error.message);
    if (data) return { goal: data as Goal };

    // 初始化：每用户 1 行 goals（user_id 默认 auth.uid()）
    const { data: created, error: createError } = await supabase
      .from('goals')
      .upsert({ user_id: userId, daily_calories: 1800 }, { onConflict: 'user_id' })
      .select('*')
      .single();
    if (createError) throw new Error(createError.message);
    return { goal: created as Goal };
  },
  update: async (daily_calories: number) => {
    const userId = await requireAuthUserId();
    const { data, error } = await supabase
      .from('goals')
      .upsert({ user_id: userId, daily_calories }, { onConflict: 'user_id' })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return { goal: data as Goal };
  },
};

export const statsApi = {
  getDaily: async (date: string) => {
    const day = date || todayStr();
    const [{ goal }, daily] = await Promise.all([goalsApi.get(), mealsApi.getDaily(day)]);
    const totalCalories = daily.meals.reduce((sum, m) => sum + Math.round(m.calories * m.quantity), 0);
    const targetCalories = goal.daily_calories;
    const stats: DailyStats = {
      date: day,
      totalCalories,
      targetCalories,
      remaining: targetCalories - totalCalories,
      meals: daily.meals,
    };
    return stats;
  },
  getWeekly: async () => {
    const { goal } = await goalsApi.get();
    const targetCalories = goal.daily_calories;

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from('meals')
      .select('date,calories,quantity')
      .gte('date', startStr)
      .lte('date', endStr);
    if (error) throw new Error(error.message);

    const byDate = new Map<string, number>();
    for (const row of (data ?? []) as Array<{ date: string; calories: number; quantity: number }>) {
      byDate.set(row.date, (byDate.get(row.date) ?? 0) + Math.round(row.calories * row.quantity));
    }

    const days: WeeklyDay[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      days.push({
        date: ds,
        totalCalories: byDate.get(ds) ?? 0,
        targetCalories,
      });
    }
    return { days };
  },
};
