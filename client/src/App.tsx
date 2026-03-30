import { useEffect, useState, useCallback } from 'react';
import Layout from './components/Layout';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import AddMealPage from './pages/AddMealPage';
import WeightPage from './pages/WeightPage';
import GoalPage from './pages/GoalPage';
import type { TabType } from './types';
import AuthPage from './pages/AuthPage';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          console.error('获取会话失败', error);
        }
        setSession(data.session ?? null);
        setAuthLoading(false);
      })
      .catch((e) => {
        if (!mounted) return;
        console.error('获取会话失败', e);
        setAuthLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const navigateTo = useCallback((tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setRefreshKey((k) => k + 1);
    }
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage key={refreshKey} />;
      case 'add':
        return <AddMealPage onSuccess={() => { showToast('记录成功'); navigateTo('home'); }} />;
      case 'weight':
        return <WeightPage onSuccess={() => showToast('体重记录成功')} />;
      case 'goal':
        return <GoalPage onSuccess={() => showToast('目标已更新')} />;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      showToast('已退出登录');
    } catch (e) {
      console.error('退出失败', e);
      showToast('退出失败', 'error');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <Layout activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout}>
        {renderPage()}
      </Layout>
    </>
  );
}
