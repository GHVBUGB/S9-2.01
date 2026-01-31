import React, { useState } from 'react';
import { Volume2, Award, Clock, ShieldAlert, Eye, Zap } from 'lucide-react';
import { WordStatus } from './types';

const WordTable = ({ words = [] }) => {
  const [revealedId, setRevealedId] = useState(null);

  const handlePlayAudio = (e, text) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const statusMap = {
    [WordStatus.MASTERED]: { color: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-50', icon: <Award size={14} />, label: '已精通' },
    [WordStatus.REVIEWING]: { color: 'bg-amber-400', text: 'text-amber-500', bg: 'bg-amber-50', icon: <Clock size={14} />, label: '复习中' },
    [WordStatus.NEEDS_WORK]: { color: 'bg-rose-500', text: 'text-rose-500', bg: 'bg-rose-50', icon: <ShieldAlert size={14} />, label: '待加强' },
  };

  if (!words || words.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>暂无单词数据</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {words.map((word) => {
        const isMastered = word.status === WordStatus.MASTERED;
        const isRevealed = isMastered || revealedId === word.id;
        const cfg = statusMap[word.status];

        return (
          <div 
            key={word.id}
            onMouseEnter={() => !isMastered && setRevealedId(word.id)}
            onMouseLeave={() => !isMastered && setRevealedId(null)}
            className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden"
          >
            {/* Tag & Audio */}
            <div className="flex justify-between items-center mb-8 relative z-10">
               <div className={`flex items-center gap-2 px-3 py-1 ${cfg.bg} rounded-full`}>
                  <span className={cfg.text}>{cfg.icon}</span>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${cfg.text}`}>{cfg.label}</span>
               </div>
               <button 
                  onClick={(e) => handlePlayAudio(e, word.vocabulary)}
                  className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all"
               >
                  <Volume2 size={16} />
               </button>
            </div>

            {/* Word content */}
            <div className="flex flex-col items-center justify-center min-h-[140px] text-center mb-6">
               <h3 className={`text-3xl font-black tracking-tighter transition-all duration-500 ${isRevealed ? 'text-slate-900' : 'text-slate-100'}`}>
                 {word.vocabulary}
               </h3>
               
               <div className={`mt-6 transition-all duration-700 ${isRevealed ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 blur-sm'}`}>
                  <p className="text-lg font-black text-slate-700">{word.meaning}</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-3 px-4 italic leading-relaxed">"{word.instance}"</p>
               </div>

               {!isRevealed && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm border border-slate-100 translate-y-4">
                      <Eye size={12} className="inline mr-1" /> 悬停解锁
                    </div>
                 </div>
               )}
            </div>

            {/* Footer progress */}
            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
               <div className="flex gap-1">
                  {[1, 2, 3, 4].map(dot => (
                    <div key={dot} className={`w-4 h-1.5 rounded-full transition-all duration-500 ${dot <= word.reviewCount ? cfg.color : 'bg-slate-100'}`} />
                  ))}
               </div>
               <div className="flex items-center gap-1">
                  <Zap size={12} className="text-indigo-400" />
                  <span className="text-[10px] font-black text-slate-300">XP +{word.reviewCount * 10}</span>
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WordTable;
