import { useState, useEffect, useCallback } from 'react';
import { goalsApi, statsApi } from '../api/client';
import type { Goal, WeeklyDay } from '../types';
import { Pencil, Check } from 'lucide-react';

interface GoalPageProps {
  onSuccess: () => void;
}

export default function GoalPage({ onSuccess }: GoalPageProps) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [weeklyDays, setWeeklyDays] = useState<WeeklyDay[]>([]);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [goalData, weeklyData] = await Promise.all([goalsApi.get(), statsApi.getWeekly()]);
      setGoal(goalData.goal);
      setWeeklyDays(weeklyData.days);
      setEditValue(String(goalData.goal.daily_calories));
    } catch (e) {
      console.error('加载失败', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    const val = Number(editValue);
    if (!val || val < 500 || val > 5000) return;

    try {
      const data = await goalsApi.update(val);
      setGoal(data.goal);
      setEditing(false);
      onSuccess();
    } catch (e) {
      console.error('更新失败', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  const weekDayNames = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">目标设置</h1>

      {/* 每日卡路里目标 */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <p className="text-sm text-gray-400 mb-1">每日卡路里目标</p>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              min="500"
              max="5000"
              className="text-3xl font-bold text-gray-800 w-32 border-b-2 border-orange-400 outline-none bg-transparent"
              autoFocus
            />
            <span className="text-base text-gray-400">千卡</span>
            <button
              onClick={handleSave}
              className="ml-auto p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              <Check size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-bold text-gray-800">{goal?.daily_calories}</span>
              <span className="text-base text-gray-400 ml-1">千卡</span>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <Pencil size={18} />
            </button>
          </div>
        )}
      </div>

      {/* 本周概览 */}
      <div className="mt-6">
        <h2 className="text-base font-semibold text-gray-700 mb-3">本周概览</h2>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-end h-32 gap-1">
            {weeklyDays.map((day) => {
              const d = new Date(day.date + 'T00:00:00');
              const dayName = weekDayNames[d.getDay()];
              const isToday = day.date === new Date().toISOString().slice(0, 10);
              const percent = day.targetCalories > 0
                ? Math.min(day.totalCalories / day.targetCalories, 1.3)
                : 0;
              const isOver = day.totalCalories > day.targetCalories;

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end h-20">
                    <p className="text-xs text-gray-400 mb-1">{day.totalCalories || ''}</p>
                    <div
                      className={`w-full max-w-[28px] rounded-t-md transition-all ${
                        isOver ? 'bg-red-400' : 'bg-orange-400'
                      } ${day.totalCalories === 0 ? 'bg-gray-200' : ''}`}
                      style={{ height: `${Math.max(percent * 60, 4)}px` }}
                    />
                  </div>
                  <p className={`text-xs mt-2 ${isToday ? 'text-orange-500 font-bold' : 'text-gray-400'}`}>
                    {dayName}
                  </p>
                </div>
              );
            })}
          </div>
          {/* 目标线说明 */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <div className="w-3 h-3 rounded-sm bg-orange-400" />
            <span className="text-xs text-gray-400">未达标</span>
            <div className="w-3 h-3 rounded-sm bg-red-400 ml-3" />
            <span className="text-xs text-gray-400">超标</span>
          </div>
        </div>
      </div>

      {/* 小贴士 */}
      <div className="mt-6 bg-orange-50 rounded-xl p-4">
        <p className="text-sm text-orange-700 font-medium mb-1">减脂小贴士</p>
        <p className="text-xs text-orange-600 leading-relaxed">
          建议每日摄入热量比消耗低 300-500 千卡，配合适量运动，每周减重 0.5-1 kg 为健康减脂速度。
          蛋白质摄入应保持在每公斤体重 1.6-2.2 克，以减少肌肉流失。
        </p>
      </div>
    </div>
  );
}
