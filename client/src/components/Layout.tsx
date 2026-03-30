import type { ReactNode } from 'react';
import BottomNav from './BottomNav';
import type { TabType } from '../types';

interface LayoutProps {
  children: ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLogout?: () => void;
}

export default function Layout({ children, activeTab, onTabChange, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* 顶部栏 */}
        <header className="sticky top-0 z-30 bg-gray-50/80 backdrop-blur border-b border-gray-100">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-500">CanMo</div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                退出
              </button>
            )}
          </div>
        </header>

        {/* 主内容区 */}
        <main className="pb-20 min-h-screen">
          {children}
        </main>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
