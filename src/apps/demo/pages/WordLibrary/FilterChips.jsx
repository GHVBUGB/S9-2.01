import React from 'react';
import { Layers, Rocket, Zap, Target, Star } from 'lucide-react';

const FilterChips = ({ options, activeFilter, onFilterChange }) => {
  const getIcon = (id) => {
    switch (id) {
      case 'all': return <Layers size={14} />;
      case 'green': return <Star size={14} />;
      case 'yellow': return <Zap size={14} />;
      case 'red': return <Target size={14} />;
      default: return <Rocket size={14} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
      <div className="flex flex-wrap justify-center gap-3 p-2 bg-slate-100/50 backdrop-blur-md rounded-[2rem] border border-white/50">
        {options.map((option) => {
          const isActive = activeFilter === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onFilterChange(option.id)}
              className={`
                relative flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-black transition-all duration-500 uppercase tracking-widest
                ${isActive 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 -translate-y-1' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                }
              `}
            >
              <span className={isActive ? 'text-indigo-400' : ''}>
                {getIcon(option.id)}
              </span>
              <span>{option.label}</span>
              <span className={`
                ml-1 px-2 py-0.5 rounded-lg text-[10px]
                ${isActive ? 'bg-white/10 text-white' : 'bg-slate-200/50 text-slate-400'}
              `}>
                {option.count}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full blur-[1px]"></div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex -space-x-2">
           {[1, 2, 3].map(i => (
             <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-400 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" />
             </div>
           ))}
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
          {options.find(o => o.id === activeFilter)?.count} 位词语守卫在当前次元
        </p>
      </div>
    </div>
  );
};

export default FilterChips;
