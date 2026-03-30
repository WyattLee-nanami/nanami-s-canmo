import type { Meal } from '../types';
import { Coffee, Sun, Moon, Cookie } from 'lucide-react';

interface DailyProgressProps {
  meals: Meal[];
}

const mealTypeConfig: Record<string, { label: string; icon: typeof Coffee; color: string }> = {
  breakfast: { label: '早餐', icon: Coffee, color: 'text-amber-500' },
  lunch: { label: '午餐', icon: Sun, color: 'text-orange-500' },
  dinner: { label: '晚餐', icon: Moon, color: 'text-indigo-500' },
  snack: { label: '加餐', icon: Cookie, color: 'text-pink-500' },
};

export default function DailyProgress({ meals }: DailyProgressProps) {
  const groups = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  return (
    <div className="grid grid-cols-4 gap-2 px-4 mb-4">
      {groups.map((type) => {
        const config = mealTypeConfig[type];
        const Icon = config.icon;
        const total = meals
          .filter((m) => m.meal_type === type)
          .reduce((sum, m) => sum + Math.round(m.calories * m.quantity), 0);

        return (
          <div key={type} className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Icon size={18} className={`mx-auto ${config.color}`} />
            <p className="text-xs text-gray-400 mt-1">{config.label}</p>
            <p className="text-sm font-semibold text-gray-700">{total}</p>
          </div>
        );
      })}
    </div>
  );
}
