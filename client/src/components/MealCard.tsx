import { Trash2 } from 'lucide-react';
import type { Meal } from '../types';

interface MealCardProps {
  meal: Meal;
  onDelete: (id: number) => void;
}

const mealTypeLabels: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
  other: '其他',
};

export default function MealCard({ meal, onDelete }: MealCardProps) {
  const totalCal = Math.round(meal.calories * meal.quantity);

  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-800 truncate">{meal.food_name}</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
            {mealTypeLabels[meal.meal_type] || '其他'}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {meal.quantity} {meal.unit} · {meal.calories} 千卡/份
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-3">
        <span className="text-orange-500 font-semibold">{totalCal} 千卡</span>
        <button
          onClick={() => onDelete(meal.id)}
          className="text-gray-300 hover:text-red-400 transition-colors p-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
