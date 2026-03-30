import { useState, useCallback } from 'react';
import Layout from './components/Layout';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import AddMealPage from './pages/AddMealPage';
import WeightPage from './pages/WeightPage';
import GoalPage from './pages/GoalPage';
import type { TabType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
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

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderPage()}
      </Layout>
    </>
  );
}
