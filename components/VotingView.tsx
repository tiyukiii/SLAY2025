
import React, { useState, useEffect } from 'react';
import { Category, Vote } from '../types';

interface VotingViewProps {
  categories: Category[];
  votes: Vote[];
  userEmail: string;
  onVote: (categoryId: string, candidateId: string) => void;
}

export const VotingView: React.FC<VotingViewProps> = ({ categories, votes, userEmail, onVote }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isCustomInputActive, setIsCustomInputActive] = useState(false);
  const [customName, setCustomName] = useState('');

  const activeCategory = categories[activeCategoryIndex];
  const userVoteInCategory = votes.find(v => v.categoryId === activeCategory.id && v.voterEmail === userEmail);
  const isCoupleCategory = activeCategory.id === 'cat4';

  // Сбрасываем состояние ввода при переключении категории
  useEffect(() => {
    setIsCustomInputActive(false);
    setCustomName('');
  }, [activeCategoryIndex]);

  const handleNext = () => {
    if (activeCategoryIndex < categories.length - 1) {
      setActiveCategoryIndex(prev => prev + 1);
    } else {
      setActiveCategoryIndex(0);
    }
  };

  const handlePrev = () => {
    if (activeCategoryIndex > 0) {
      setActiveCategoryIndex(prev => prev - 1);
    } else {
      setActiveCategoryIndex(categories.length - 1);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      onVote(activeCategory.id, `custom:${customName.trim()}`);
      setIsCustomInputActive(false);
    }
  };

  const isCurrentVoteCustom = userVoteInCategory?.candidateId.startsWith('custom:');
  const customVoteName = isCurrentVoteCustom ? userVoteInCategory?.candidateId.replace('custom:', '') : '';

  const renderAvatar = (candidate: any) => {
    if (isCoupleCategory) {
      const names = candidate.name.split(' и ');
      const person1 = names[0] || '1';
      const person2 = names[1] || '2';
      
      return (
        <div className="relative w-14 h-14 flex-shrink-0">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(person1)}&mood[]=happy`} 
            alt={person1}
            className="w-10 h-10 rounded-full border-2 border-[#050505] absolute top-0 left-0 z-10 bg-gray-800"
          />
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(person2)}&mood[]=happy&top[]=longHair`} 
            alt={person2}
            className="w-10 h-10 rounded-full border-2 border-[#050505] absolute bottom-0 right-0 z-0 bg-gray-900"
          />
        </div>
      );
    }
    
    return (
      <img 
        src={candidate.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(candidate.name)}`} 
        alt={candidate.name}
        className="w-12 h-12 rounded-full border border-white/10 flex-shrink-0 bg-gray-800"
      />
    );
  };

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="text-center space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-xs font-bold tracking-widest mb-2">
          КАТЕГОРИЯ {activeCategoryIndex + 1} ИЗ {categories.length}
        </div>
        <div className="text-5xl mb-4">{activeCategory.emoji}</div>
        <h2 className="text-3xl font-black">{activeCategory.title}</h2>
        <p className="text-gray-400">{activeCategory.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeCategory.candidates.map((candidate) => {
          const isSelected = userVoteInCategory?.candidateId === candidate.id;
          return (
            <button
              key={candidate.id}
              onClick={() => onVote(activeCategory.id, candidate.id)}
              className={`p-4 rounded-2xl flex items-center space-x-4 transition-all active:scale-95 text-left ${
                isSelected 
                  ? 'bg-pink-500/20 border-2 border-pink-500/50' 
                  : 'glass border border-white/5 hover:bg-white/10'
              }`}
            >
              {renderAvatar(candidate)}
              <div className="flex-1 min-w-0">
                <div className={`font-bold truncate ${isSelected ? 'text-pink-400' : 'text-white'}`}>
                  {candidate.name}
                </div>
                <div className="text-xs text-gray-500 tracking-wider font-semibold">
                  {isSelected ? 'твой выбор' : (isCoupleCategory ? 'кандидаты' : 'кандидат')}
                </div>
              </div>
              {isSelected && (
                <div className="bg-pink-500 rounded-full p-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </button>
          );
        })}

        {/* Свой вариант */}
        {!isCustomInputActive ? (
          <button
            onClick={() => setIsCustomInputActive(true)}
            className={`p-4 rounded-2xl flex items-center space-x-4 transition-all active:scale-95 text-left ${
              isCurrentVoteCustom 
                ? 'bg-pink-500/20 border-2 border-pink-500/50' 
                : 'glass border-2 border-dashed border-white/10 hover:border-white/20'
            }`}
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-gray-500 flex-shrink-0 bg-white/5">
              {isCurrentVoteCustom ? '✨' : '+'}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-bold truncate ${isCurrentVoteCustom ? 'text-pink-400' : 'text-gray-400'}`}>
                {isCurrentVoteCustom ? customVoteName : 'Свой вариант'}
              </div>
              <div className="text-xs text-gray-500 tracking-wider font-semibold">
                {isCurrentVoteCustom ? 'твой выбор' : 'впиши имя'}
              </div>
            </div>
            {isCurrentVoteCustom && (
              <div className="bg-pink-500 rounded-full p-1 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            )}
          </button>
        ) : (
          <form 
            onSubmit={handleCustomSubmit}
            className="p-4 rounded-2xl glass border-2 border-pink-500/50 flex flex-col space-y-2 col-span-1 sm:col-span-1"
          >
            <input 
              autoFocus
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Введите имя..."
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500/50 text-white w-full"
            />
            <div className="flex space-x-2">
              <button 
                type="submit"
                className="flex-1 gradient-bg text-white text-xs font-bold py-2 rounded-xl"
              >
                Сохранить
              </button>
              <button 
                type="button"
                onClick={() => setIsCustomInputActive(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold py-2 rounded-xl"
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="flex justify-between items-center pt-8">
        <button 
          onClick={handlePrev}
          className="p-3 rounded-full glass hover:bg-white/10 transition-all active:scale-90"
          title="Назад"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>

        <div className="flex flex-wrap justify-center gap-1.5 max-w-[200px] sm:max-w-none">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 tracking-tighter">
            <span className="text-pink-500">{activeCategoryIndex + 1}</span>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-500 transition-all duration-300" 
                style={{ width: `${((activeCategoryIndex + 1) / categories.length) * 100}%` }}
              ></div>
            </div>
            <span>{categories.length}</span>
          </div>
        </div>

        <button 
          onClick={handleNext}
          className="p-3 rounded-full gradient-bg hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-pink-500/20"
          title="Вперед"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
  );
};
