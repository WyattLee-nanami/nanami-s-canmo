import { useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

type Mode = 'signin' | 'signup';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const title = useMemo(() => (mode === 'signin' ? '登录' : '注册'), [mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo('注册成功。你现在可以登录。');
        setMode('signin');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '操作失败，请重试';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">CanMo 需要账号来隔离你的数据。</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-4 rounded-lg bg-green-50 text-green-700 text-sm px-3 py-2">
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="text-sm text-gray-600">邮箱</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-200"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600">密码</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-200"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              required
              minLength={6}
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-orange-600 text-white py-2 font-medium disabled:opacity-60"
          >
            {submitting ? '处理中...' : title}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          {mode === 'signin' ? (
            <button
              className="text-orange-700 font-medium hover:underline"
              onClick={() => { setMode('signup'); setError(null); setInfo(null); }}
            >
              没有账号？去注册
            </button>
          ) : (
            <button
              className="text-orange-700 font-medium hover:underline"
              onClick={() => { setMode('signin'); setError(null); setInfo(null); }}
            >
              已有账号？去登录
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

