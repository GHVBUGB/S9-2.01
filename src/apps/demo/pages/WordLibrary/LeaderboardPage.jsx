import React from 'react';
import { Trophy, Crown, Star, Swords, TrendingUp, Sparkles, Medal } from 'lucide-react';

const LeaderboardPage = ({ students }) => {
  const sortedStudents = [...students].sort((a, b) => {
    if (b.masteredCount !== a.masteredCount) return b.masteredCount - a.masteredCount;
    return a.name.localeCompare(b.name, 'zh-CN');
  });
  
  const top3 = sortedStudents.slice(0, 3);
  const restStudents = sortedStudents.slice(3);

  const getRankBadge = (rank) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-300 to-orange-400 text-white shadow-yellow-200";
    if (rank === 2) return "bg-gradient-to-br from-slate-200 to-slate-400 text-white shadow-slate-100";
    if (rank === 3) return "bg-gradient-to-br from-orange-200 to-orange-500 text-white shadow-orange-100";
    if (rank <= 10) return "bg-indigo-50 text-indigo-500 border border-indigo-100";
    return "text-slate-300";
  };

  return (
    <div className="relative">
      {/* Background Decorative Elements */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 -right-20 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* --- PODIUM SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Second Place */}
        <div className="order-2 md:order-1 flex flex-col items-center justify-end pt-12">
          <div className="w-full bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-soft relative flex flex-col items-center group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute -top-12">
               <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-2xl font-black text-slate-400 shadow-xl">
                 {top3[1]?.name?.charAt(0) || '?'}
               </div>
               <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center text-sm font-black border-2 border-white shadow-lg">2</div>
            </div>
            <div className="mt-8 text-center w-full">
              <h4 className="text-xl font-black text-slate-800 tracking-tight mb-1">{top3[1]?.name || 'N/A'}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">掌握词汇</p>
              <div className="bg-slate-50 rounded-2xl py-3 px-6 inline-flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 leading-none">{top3[1]?.masteredCount || 0}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Points</span>
              </div>
            </div>
          </div>
        </div>

        {/* First Place */}
        <div className="order-1 md:order-2 flex flex-col items-center">
          <Crown className="w-10 h-10 text-amber-400 fill-amber-400 mb-2 animate-bounce" />
          <div className="w-full bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-indigo-200/50 relative flex flex-col items-center group hover:scale-[1.05] transition-all duration-500">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="absolute -top-14">
               <div className="w-28 h-28 rounded-full border-4 border-slate-900 bg-gradient-to-br from-yellow-200 to-amber-200 flex items-center justify-center text-4xl font-black text-amber-700 shadow-2xl">
                 {top3[0]?.name?.charAt(0) || '?'}
               </div>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center text-lg font-black border-4 border-slate-900 shadow-lg">1</div>
            </div>
            
            <div className="mt-14 text-center w-full relative z-10">
              <h4 className="text-2xl font-black text-white tracking-tight mb-1 flex items-center justify-center gap-2">
                {top3[0]?.name || 'N/A'}
                <Sparkles size={18} className="text-yellow-400 animate-pulse" />
              </h4>
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-6">全服最强探索者</p>
              
              <div className="bg-white/10 rounded-[2rem] py-4 px-8 inline-flex items-center gap-3 backdrop-blur-md">
                <div className="text-left">
                  <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest">掌握点数</p>
                  <p className="text-3xl font-black text-white leading-none mt-1">{top3[0]?.masteredCount || 0}</p>
                </div>
                <div className="h-10 w-px bg-white/20 mx-2"></div>
                <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Trophy size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Place */}
        <div className="order-3 flex flex-col items-center justify-end pt-12">
          <div className="w-full bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-soft relative flex flex-col items-center group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute -top-12">
               <div className="w-20 h-20 rounded-full border-4 border-white bg-orange-50 flex items-center justify-center text-2xl font-black text-orange-400 shadow-xl">
                 {top3[2]?.name?.charAt(0) || '?'}
               </div>
               <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center text-sm font-black border-2 border-white shadow-lg">3</div>
            </div>
            <div className="mt-8 text-center w-full">
              <h4 className="text-xl font-black text-slate-800 tracking-tight mb-1">{top3[2]?.name || 'N/A'}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">掌握词汇</p>
              <div className="bg-orange-50 rounded-2xl py-3 px-6 inline-flex items-center gap-2">
                <span className="text-2xl font-black text-orange-600 leading-none">{top3[2]?.masteredCount || 0}</span>
                <span className="text-[10px] font-bold text-orange-300 uppercase">Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- LIST SECTION --- */}
      <div className="bg-white/50 backdrop-blur-xl rounded-[3rem] p-8 sm:p-12 border border-white shadow-soft">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">次元排行榜</h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100/50 rounded-full">
            <span className="text-[10px] font-black text-slate-400 uppercase">当前活跃词友:</span>
            <span className="text-[10px] font-black text-indigo-600">100+</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
          {restStudents.map((student, idx) => {
            const rank = idx + 4;
            const isMe = student.isCurrentUser;
            const rankStyle = getRankBadge(rank);
            
            return (
              <div 
                key={student.id}
                className={`
                  group flex items-center justify-between p-4 rounded-3xl transition-all duration-300
                  ${isMe 
                    ? 'bg-slate-900 text-white shadow-2xl -translate-y-1 z-10 border-indigo-500/20' 
                    : 'bg-white/40 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-lg'
                  }
                `}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`
                    w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm
                    ${rankStyle}
                  `}>
                    {rank <= 3 ? <Medal size={16} /> : rank}
                  </div>
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm overflow-hidden shrink-0 ${isMe ? 'bg-indigo-500' : 'bg-slate-100 text-slate-500'}`}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt="avatar" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`font-black text-base truncate leading-tight ${isMe ? 'text-white' : 'text-slate-800'}`}>
                      {student.name}
                      {isMe && <span className="ml-2 text-[8px] font-black bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">ME</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-full max-w-[60px] h-1 rounded-full overflow-hidden ${isMe ? 'bg-white/10' : 'bg-slate-100'}`}>
                        <div className="bg-emerald-400 h-full transition-all duration-1000" style={{ width: `${(student.masteredCount / 10) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right pl-4">
                  <p className={`text-xl font-black leading-none ${isMe ? 'text-white' : 'text-slate-900'}`}>{student.masteredCount}</p>
                  <p className={`text-[8px] font-black uppercase tracking-[0.2em] mt-1 ${isMe ? 'text-indigo-300' : 'text-slate-300'}`}>Points</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-100 group">
            <Swords size={20} className="group-hover:rotate-12 transition-transform" />
            参与次元挑战，提升你的排名
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;

