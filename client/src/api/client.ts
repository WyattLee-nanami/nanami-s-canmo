import type { Meal, WeightRecord, Goal, DailyStats, WeeklyDay } from '../types';

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '请求失败' }));
    throw new Error(err.error || `请求失败: ${res.status}`);
  }
  return res.json();
}

export const mealsApi = {
  getDaily: (date: string) =>
    request<{ date: string; meals: Meal[]; totalCalories: number }>(`/meals/daily?date=${date}`),
  create: (meal: {
    food_name: string;
    calories: number;
    quantity?: number;
    unit?: string;
    meal_type?: string;
    date?: string;
  }) => request<{ meal: Meal }>('/meals', { method: 'POST', body: JSON.stringify(meal) }),
  remove: (id: number) => request<{ success: boolean }>(`/meals/${id}`, { method: 'DELETE' }),
};

export const weightApi = {
  getAll: () => request<{ records: WeightRecord[] }>('/weight'),
  create: (weight: number, date?: string) =>
    request<{ record: WeightRecord }>('/weight', {
      method: 'POST',
      body: JSON.stringify({ weight, date }),
    }),
};

export const goalsApi = {
  get: () => request<{ goal: Goal }>('/goals'),
  update: (daily_calories: number) =>
    request<{ goal: Goal }>('/goals', {
      method: 'PUT',
      body: JSON.stringify({ daily_calories }),
    }),
};

export const statsApi = {
  getDaily: (date: string) => request<DailyStats>(`/stats/daily?date=${date}`),
  getWeekly: () => request<{ days: WeeklyDay[] }>('/stats/weekly'),
};
