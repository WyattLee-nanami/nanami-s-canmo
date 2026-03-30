import { useState, useEffect, useCallback } from 'react';
import CalorieRing from '../components/CalorieRing';
import DailyProgress from '../components/DailyProgress';
import MealCard from '../components/MealCard';
import { statsApi, mealsApi } from '../api/client';
import type { DailyStats } from '../types';

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export default function HomePage() {
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const data = await statsApi.getDaily(getToday());
      setStats(data);
    } catch (e) {
      console.error('加载失败', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleDelete = async (id: number) => {
    try {
      await mealsApi.remove(id);
      loadStats();
    } catch (e) {
      console.error('删除失败', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">加载失败，请重试</p>
      </div>
    );
  }

  const today = new Date();
  const dayOfWeek = weekDays[today.getDay()];

  return (
    <div className="p-4">
      {/* 头部 */}
      <div className="mb-2">
        <h1 className="text-xl font-bold text-gray-800">今日摘要</h1>
        <p className="text-sm text-gray-400">
          {formatDate(stats.date)} 星期{dayOfWeek}
        </p>
      </div>

      {/* 卡路里环 */}
      <CalorieRing consumed={stats.totalCalories} target={stats.targetCalories} />

      {/* 分类进度 */}
      <DailyProgress meals={stats.meals} />

      {/* 餐食列表 */}
      <div className="mt-4">
        <h2 className="text-base font-semibold text-gray-700 mb-3 px-1">今日饮食</h2>
        {stats.meals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">暂无饮食记录</p>
            <p className="text-gray-300 text-xs mt-1">点击下方「记录」添加</p>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
