import { useState } from 'react';
import { weightApi } from '../api/client';

interface WeightFormProps {
  onSuccess: () => void;
}

export default function WeightForm({ onSuccess }: WeightFormProps) {
  const [weight, setWeight] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    setSubmitting(true);
    try {
      await weightApi.create(Number(weight));
      setWeight('');
      onSuccess();
    } catch (e) {
      console.error('记录失败', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="输入体重"
          step="0.1"
          min="20"
          max="300"
          className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none text-gray-800"
          required
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kg</span>
      </div>
      <button
        type="submit"
        disabled={submitting || !weight}
        className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-orange-600 active:bg-orange-700 transition-colors shrink-0"
      >
        {submitting ? '...' : '记录'}
      </button>
    </form>
  );
}
