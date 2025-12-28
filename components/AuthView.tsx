
import React, { useState } from 'react';

interface AuthViewProps {
  onLogin: (email: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      onLogin(email);
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <h1 className="text-5xl font-black leading-tight">
          Кто правит <br />
          <span className="gradient-text">в нашей тусовке?</span>
        </h1>
        <p className="text-gray-400 max-w-sm mx-auto">
          Номинируй друзей, голосуй за лучший вайб и узнай, кто действительно «слэй» в этом году.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-sm">
        <div className="relative group">
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="твой@email.com"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-gray-600 group-hover:bg-white/10 text-center"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full gradient-bg text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-500/20 active:scale-95 transition-all hover:opacity-90"
        >
          Войти в игру
        </button>
        <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">
          Бесплатная регистрация по почте
        </p>
      </form>
    </div>
  );
};
