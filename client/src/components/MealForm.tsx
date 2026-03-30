import { useState } from 'react';
import { mealsApi } from '../api/client';

interface MealFormProps {
  onSuccess: () => void;
}

const mealTypes = [
  { value: 'breakfast', label: '早餐' },
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
  { value: 'snack', label: '加餐' },
];

const units = ['份', '克', '毫升', '个', '杯', '碗'];

export default function MealForm({ onSuccess }: MealFormProps) {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('份');
  const [mealType, setMealType] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 10) return 'breakfast';
    if (hour < 14) return 'lunch';
    if (hour < 20) return 'dinner';
    return 'snack';
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || !calories) return;

    setSubmitting(true);
    try {
      await mealsApi.create({
        food_name: foodName.trim(),
        calories: Number(calories),
        quantity: Number(quantity) || 1,
        unit,
        meal_type: mealType,
        date: new Date().toISOString().slice(0, 10),
      });
      onSuccess();
    } catch (e) {
      console.error('添加失败', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 食物名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">食物名称</label>
        <input
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="例如：鸡胸肉沙拉"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none text-gray-800"
          required
        />
      </div>

      {/* 卡路里 */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">卡路里 (千卡/份)</label>
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="例如：350"
          min="0"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none text-gray-800"
          required
        />
      </div>

      {/* 数量和单位 */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">数量</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0.1"
            step="0.1"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none text-gray-800"
          />
        </div>
        <div className="w-28">
          <label className="block text-sm font-medium text-gray-600 mb-1">单位</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none text-gray-800 bg-white"
          >
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 餐别 */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">餐别</label>
        <div className="flex gap-2">
          {mealTypes.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMealType(value)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                mealType === value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 提交 */}
      <button
        type="submit"
        disabled={submitting || !foodName.trim() || !calories}
        className="w-full py-3.5 bg-orange-500 text-white rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 active:bg-orange-700 transition-colors mt-2"
      >
        {submitting ? '保存中...' : '保存记录'}
      </button>
    </form>
  );
}
