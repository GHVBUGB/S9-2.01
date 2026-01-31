import React from 'react';
import { Flame, Star, Trophy, Target, CheckCircle2, Zap, Activity, ChevronRight, Globe } from 'lucide-react';
import { WordStatus } from './types';

const MasteryDashboard = ({ words = [], onVocabularyClick, onRankClick, isMatrixVisible }) => {
  const total = 500;
  const learned = words?.length || 0;
  const mastered = words?.filter(w => w.status === WordStatus.MASTERED).length || 0;
  const learnedPct = Math.round((learned / total) * 100);
  const masteredPct = learned > 0 ? Math.round((mastered / learned) * 100) : 0;

  const heatmap = [3, 5, 2, 8, 4, 10, 6];

  return (
    <div className="space-y-6 mb-12 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Mastery Core */}
        <div className="lg:col-span-1 bg-white rounded-[3rem] p-10 shadow-soft border border-slate-50 flex flex-col items-center justify-center relative">
          <div className="relative w-52 h-52">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
              <circle 
                cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={565}
                strokeDashoffset={565 - (565 * learnedPct) / 100}
                strokeLinecap="round"
                className="text-indigo-500 transition-all duration-1000 ease-out"
              />
              <circle 
                cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" 
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * masteredPct) / 100}
                strokeLinecap="round"
                className="text-emerald-400 transition-all duration-1000 delay-300 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Lex Level</span>
               <span className="text-6xl font-black text-slate-900 leading-none tracking-tighter italic">12</span>
               <div className="mt-3 px-4 py-1.5 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-500 uppercase">探索者</div>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-50">
             <button 
                onClick={onVocabularyClick}
                className={`flex flex-col items-center p-4 rounded-[2rem] transition-all group relative border-2 ${isMatrixVisible ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-50 border-transparent hover:bg-white hover:border-indigo-100 active:scale-95 shadow-sm'}`}
             >
                <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mb-1 transition-colors ${isMatrixVisible ? 'text-indigo-200' : 'text-slate-400'}`}>
                  词汇量 <ChevronRight size={12} className={`transition-transform ${isMatrixVisible ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
                </span>
                <p className={`text-2xl font-black transition-colors ${isMatrixVisible ? 'text-white' : 'text-slate-900'}`}>
                  {learned}<span className={`text-sm font-bold opacity-40 ml-1`}>/ {total}</span>
                </p>
                {!isMatrixVisible && <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white animate-pulse"></div>}
             </button>

             <div className="flex flex-col items-center p-4 rounded-[2rem] bg-slate-50 border-2 border-transparent">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">精通度</p>
                <p className="text-2xl font-black text-emerald-500">{masteredPct}%</p>
             </div>
          </div>
        </div>

        {/* 2. Consistency & Activity */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-soft border border-slate-50 flex flex-col justify-between overflow-hidden relative">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                <Flame size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">学习火花</h3>
                <p className="text-sm font-bold text-slate-400">连续活跃 <span className="text-orange-500 font-black">7</span> 天</p>
              </div>
            </div>
            <div className="flex gap-1.5">
               {[1, 2, 3].map(i => <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />)}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-end justify-between gap-3 h-24 px-2">
               {heatmap.map((val, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-slate-50 rounded-full relative overflow-hidden transition-all duration-700" 
                      style={{ height: `${val * 10}%` }}
                    >
                       <div className="absolute inset-0 bg-orange-500/80"></div>
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase">D{i+1}</span>
                 </div>
               ))}
            </div>
            
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2.5rem] border border-white">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Target className="text-indigo-500" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase">今日挑战</p>
                    <p className="text-base font-bold text-slate-800">消灭 5 个红灯核心单词</p>
                  </div>
               </div>
               <button className="bg-slate-900 text-white px-8 py-3.5 rounded-full text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all">
                 立即打卡
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Achievements */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Trophy />, title: "次元勋章", count: "100", color: "text-yellow-500", bg: "bg-yellow-50" },
          { icon: <CheckCircle2 />, title: "准确率", count: "98%", color: "text-emerald-500", bg: "bg-emerald-50" },
          { icon: <Activity />, title: "专注时长", count: "12h", color: "text-indigo-500", bg: "bg-indigo-50" },
          { 
            icon: <Globe />, 
            title: "次元排名", 
            count: "Top 3", 
            color: "text-rose-500", 
            bg: "bg-rose-50", 
            clickable: true,
            onClick: onRankClick 
          },
        ].map((item, i) => (
          <button 
            key={i} 
            disabled={!item.clickable}
            onClick={item.onClick}
            className={`bg-white p-5 rounded-[2.5rem] border border-slate-50 shadow-soft flex items-center gap-4 group transition-all text-left ${item.clickable ? 'hover:bg-slate-50 cursor-pointer active:scale-95' : 'cursor-default'}`}
          >
            <div className={`w-12 h-12 rounded-full ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
              {React.cloneElement(item.icon, { size: 22 })}
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest truncate flex items-center gap-1">
                {item.title} {item.clickable && <ChevronRight size={10} />}
              </p>
              <p className="font-black text-slate-800 text-base">{item.count}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MasteryDashboard;

