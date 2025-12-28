
import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_CATEGORIES } from './constants';
import { Category, Vote, User } from './types';
import { AuthView } from './components/AuthView';
import { VotingView } from './components/VotingView';
import { DashboardView } from './components/DashboardView';
import { Header } from './components/Header';

// Инициализация Supabase с твоими данными
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase env variables are missing');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'auth' | 'voting' | 'dashboard'>('auth');
  const [votes, setVotes] = useState<Vote[]>([]);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка данных из Supabase
  const fetchVotes = useCallback(async () => {
    const { data, error } = await supabase
      .from('votes')
      .select('*');
    
    if (data) {
      const formattedVotes: Vote[] = data.map(v => ({
        id: v.id,
        categoryId: v.category_id,
        candidateId: v.candidate_id,
        voterEmail: v.voter_email,
        timestamp: new Date(v.created_at).getTime()
      }));
      setVotes(formattedVotes);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('slay_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('voting');
    }
    fetchVotes();

    // Подписка на обновления в реальном времени
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', table: 'votes' }, () => {
        fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchVotes]);

  const handleLogin = (email: string) => {
    const newUser = { email, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem('slay_user', JSON.stringify(newUser));
    setView('voting');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('slay_user');
    setView('auth');
  };

  const handleVote = useCallback(async (categoryId: string, candidateId: string) => {
    if (!user) return;

    const voteData = {
      category_id: categoryId,
      candidate_id: candidateId,
      voter_email: user.email
    };

    // Используем upsert, чтобы обновить голос, если пользователь передумал
    const { error } = await supabase
      .from('votes')
      .upsert(voteData, { onConflict: 'category_id, voter_email' });

    if (error) {
      console.error('Ошибка при голосовании:', error);
      alert('Ошибка при сохранении голоса. Убедитесь, что таблица "votes" создана корректно в Supabase.');
    } else {
      // Оптимистичное обновление или загрузка заново
      fetchVotes();
    }
  }, [user, fetchVotes]);

  return (
    <div className="min-h-screen flex flex-col items-center pb-20 px-4 max-w-2xl mx-auto">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onViewChange={setView} 
        activeView={view} 
      />

      <main className="w-full mt-24">
        {view === 'auth' && (
          <AuthView onLogin={handleLogin} />
        )}

        {view === 'voting' && user && (
          <VotingView 
            categories={categories} 
            votes={votes} 
            userEmail={user.email}
            onVote={handleVote} 
          />
        )}

        {view === 'dashboard' && (
          <DashboardView 
            categories={categories} 
            votes={votes} 
          />
        )}
      </main>

      <div className="mt-12 p-6 glass rounded-2xl text-sm text-gray-400 leading-relaxed max-w-md">
        <div className="text-green-400 font-bold border-b border-green-500/20 pb-2 mb-4 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>База данных Supabase подключена</span>
        </div>
        <h3 className="font-bold text-white mb-2">Все готово для Netlify!</h3>
        <p className="mb-4">Твой бэкенд настроен. Теперь все голоса друзей будут сохраняться в твою таблицу в Supabase в реальном времени.</p>
        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
          <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Твой проект:</p>
          <code className="text-pink-400 break-all">mfdxgqpmpmjyyxnfzrrv</code>
        </div>
      </div>
    </div>
  );
};

export default App;
