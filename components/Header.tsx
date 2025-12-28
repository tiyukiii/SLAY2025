
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onViewChange: (view: 'voting' | 'dashboard') => void;
  activeView: string;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onViewChange, activeView }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-6">
      <div className="max-w-2xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">SLAY <span className="text-gray-500">2025</span></span>
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onViewChange('voting')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeView === 'voting' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Голосовать
            </button>
            <button 
              onClick={() => onViewChange('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeView === 'dashboard' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Итоги
            </button>
            <div className="h-4 w-px bg-white/10 mx-1"></div>
            <button 
              onClick={onLogout}
              className="text-gray-400 hover:text-pink-500 transition-colors"
              title="Выйти"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        ) : (
          <div className="text-xs text-gray-500 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
            ВОЙДИТЕ, ЧТОБЫ ГОЛОСОВАТЬ
          </div>
        )}
      </div>
    </header>
  );
};
