export interface Meal {
  id: number;
  food_name: string;
  calories: number;
  quantity: number;
  unit: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  date: string;
  created_at: string;
}

export interface WeightRecord {
  id: number;
  weight: number;
  date: string;
  created_at: string;
}

export interface Goal {
  id: number;
  daily_calories: number;
  created_at: string;
  updated_at: string;
}

export interface DailyStats {
  date: string;
  totalCalories: number;
  targetCalories: number;
  remaining: number;
  meals: Meal[];
}

export interface WeeklyDay {
  date: string;
  totalCalories: number;
  targetCalories: number;
}
