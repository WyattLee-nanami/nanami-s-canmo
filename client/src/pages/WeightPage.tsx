import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import WeightForm from '../components/WeightForm';
import { weightApi } from '../api/client';
import type { WeightRecord } from '../types';

interface WeightPageProps {
  onSuccess: () => void;
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function WeightPage({ onSuccess }: WeightPageProps) {
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(async () => {
    try {
      const data = await weightApi.getAll();
      setRecords(data.records);
    } catch (e) {
      console.error('加载失败', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleSuccess = () => {
    loadRecords();
    onSuccess();
  };

  const chartData = records.slice(-30).map((r) => ({
    date: formatDateShort(r.date),
    weight: r.weight,
  }));

  const latestWeight = records.length > 0 ? records[records.length - 1].weight : null;
  const firstWeight = records.length > 1 ? records[0].weight : null;
  const diff = latestWeight && firstWeight ? (latestWeight - firstWeight).toFixed(1) : null;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">体重追踪</h1>

      {/* 体重输入 */}
      <WeightForm onSuccess={handleSuccess} />

      {/* 当前体重 */}
      {latestWeight && (
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-sm text-gray-400">当前体重</p>
              <p className="text-3xl font-bold text-gray-800">
                {latestWeight} <span className="text-base font-normal text-gray-400">kg</span>
              </p>
            </div>
            {diff && (
              <div className={`text-sm font-medium ${Number(diff) <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Number(diff) > 0 ? '+' : ''}{diff} kg
              </div>
            )}
          </div>
        </div>
      )}

      {/* 折线图 */}
      <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-sm font-medium text-gray-600 mb-4">体重趋势</h2>
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-gray-400 text-sm">加载中...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-gray-400 text-sm">暂无数据，请先记录体重</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  fontSize: '13px',
                }}
                formatter={(value: number) => [`${value} kg`, '体重']}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4, fill: '#f97316' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 历史记录 */}
      {records.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-medium text-gray-600 mb-3">历史记录</h2>
          <div className="space-y-2">
            {[...records].reverse().slice(0, 10).map((r) => (
              <div key={r.id} className="bg-white rounded-xl px-4 py-3 shadow-sm flex justify-between items-center">
                <span className="text-gray-500 text-sm">{r.date}</span>
                <span className="font-medium text-gray-800">{r.weight} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
