import React from 'react';
import { WordStatus } from './types';

const FooterStats = ({ counts }) => {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 pointer-events-none flex justify-center px-4">
      <div className="bg-white/90 backdrop-blur-md rounded-full border border-white/50 shadow-soft px-1 pointer-events-auto flex items-center p-1.5 gap-2">
        
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="font-bold text-xs text-slate-600">Active Session</span>
        </div>

        <div className="flex items-center">
            {/* Needs Work */}
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-rose-50 transition-colors cursor-pointer group">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-xs font-bold text-slate-600 group-hover:text-rose-600">
                {counts[WordStatus.NEEDS_WORK] || 0} <span className="hidden sm:inline font-normal text-slate-400">Retry</span>
              </span>
           </div>
           
           {/* Reviewing */}
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-amber-50 transition-colors cursor-pointer group">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-xs font-bold text-slate-600 group-hover:text-amber-600">
                {counts[WordStatus.REVIEWING] || 0} <span className="hidden sm:inline font-normal text-slate-400">Review</span>
              </span>
           </div>

           {/* Mastered */}
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-emerald-50 transition-colors cursor-pointer group">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-600">
                {counts[WordStatus.MASTERED] || 0} <span className="hidden sm:inline font-normal text-slate-400">Done</span>
              </span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default FooterStats;

