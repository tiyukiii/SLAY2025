
import React from 'react';
import { Category, Vote, Candidate } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardViewProps {
  categories: Category[];
  votes: Vote[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ categories, votes }) => {
  const getCategoryStats = (categoryId: string) => {
    const categoryVotes = votes.filter(v => v.categoryId === categoryId);
    const category = categories.find(c => c.id === categoryId);
    if (!category) return [];

    const counts: Record<string, { count: number, name: string }> = {};
    
    // Сначала инициализируем штатных кандидатов
    category.candidates.forEach(cand => {
      counts[cand.id] = { count: 0, name: cand.name };
    });

    // Считаем голоса
    categoryVotes.forEach(v => {
      if (v.candidateId.startsWith('custom:')) {
        const customName = v.candidateId.replace('custom:', '');
        const customKey = `c_${customName}`;
        if (!counts[customKey]) {
          counts[customKey] = { count: 1, name: customName };
        } else {
          counts[customKey].count += 1;
        }
      } else if (counts[v.candidateId]) {
        counts[v.candidateId].count += 1;
      }
    });

    return Object.entries(counts)
      .map(([id, data]) => ({
        id,
        name: data.name.split(' ')[0], // Короткое имя для графика
        fullName: data.name,
        votes: data.count
      }))
      .filter(item => item.votes > 0 || category.candidates.some(c => c.id === item.id))
      .sort((a, b) => b.votes - a.votes);
  };

  const totalVoters = new Set(votes.map(v => v.voterEmail)).size;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black">Текущие итоги</h2>
        <p className="text-gray-400">Пульс вашей компании в реальном времени</p>
        <div className="inline-flex items-center space-x-4 glass px-6 py-2 rounded-full mt-4 text-sm">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-gray-300 font-medium">Отдано голосов: {votes.length}</span>
          </div>
          <div className="w-px h-3 bg-white/20"></div>
          <div className="text-gray-300 font-medium">Участников: {totalVoters}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {categories.map((cat) => {
          const stats = getCategoryStats(cat.id);
          const winner = stats[0];
          
          return (
            <div key={cat.id} className="glass rounded-3xl p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl -z-10 rounded-full"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xl">{cat.emoji}</span>
                    <h3 className="text-xl font-bold">{cat.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{cat.description}</p>
                </div>
                {winner && winner.votes > 0 && (
                  <div className="text-right">
                    <div className="text-[10px] text-pink-400 font-black uppercase tracking-widest">Лидирует</div>
                    <div className="text-lg font-black text-white">{winner.fullName}</div>
                  </div>
                )}
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#666', fontSize: 12}} 
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px'}}
                      labelStyle={{color: '#999'}}
                      formatter={(value: any, name: any, props: any) => [value, 'Голосов']}
                      labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
                    />
                    <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                      {stats.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 && entry.votes > 0 ? '#ec4899' : '#333'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
