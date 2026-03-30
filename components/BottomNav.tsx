import { Calendar, History, Home, Plus, User } from 'lucide-react';
import React from 'react';

export default function BottomNav({ current, onNavigate }: { current: string, onNavigate: (s: string) => void }) {
  return (
    <div className="bg-white border-t border-gray-100 flex justify-between items-center px-6 py-2 pb-6 absolute bottom-0 w-full z-10">
      <button onClick={() => onNavigate('home')} className={`flex flex-col items-center ${current === 'home' ? 'text-orange-600' : 'text-gray-400'}`}>
        <Home size={24} />
        <span className="text-[10px] mt-1 font-medium">首页</span>
      </button>
      <button onClick={() => onNavigate('explore')} className={`flex flex-col items-center ${current === 'explore' ? 'text-orange-600' : 'text-gray-400'}`}>
        <Calendar size={24} />
        <span className="text-[10px] mt-1 font-medium">计划</span>
      </button>
      
      <div className="relative -top-5">
        <button onClick={() => onNavigate('camera')} className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-200 border-4 border-white transition-transform active:scale-95">
          <Plus size={28} />
        </button>
      </div>

      <button onClick={() => onNavigate('profile')} className={`flex flex-col items-center ${current === 'history' ? 'text-orange-600' : 'text-gray-400'}`}>
        <History size={24} />
        <span className="text-[10px] mt-1 font-medium">历史</span>
      </button>
      <button onClick={() => onNavigate('profile')} className={`flex flex-col items-center ${current === 'profile' ? 'text-orange-600' : 'text-gray-400'}`}>
        <User size={24} />
        <span className="text-[10px] mt-1 font-medium">个人中心</span>
      </button>
    </div>
  );
}
