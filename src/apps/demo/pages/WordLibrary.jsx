import React, { useState, useMemo, useRef, useEffect } from 'react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import SimpleHeader from '../components/SimpleHeader';
import MasteryDashboard from './WordLibrary/MasteryDashboard';
import FilterChips from './WordLibrary/FilterChips';
import WordTable from './WordLibrary/WordTable';
import FooterStats from './WordLibrary/FooterStats';
import LeaderboardPage from './WordLibrary/LeaderboardPage';
import { WordStatus } from './WordLibrary/types';
import { generateMockWords, generateMockLeaderboard } from './WordLibrary/constants';
import { LayoutGrid, Sparkles, Search, Boxes, ArrowLeft, Database, Trophy } from 'lucide-react';

const WordLibrary = () => {
  const { initialized, initializeFromMockData, redWords, yellowWords, greenWords } = useWordStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [view, setView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const leaderboardRef = useRef(null);

  // 初始化数据
  useEffect(() => {
    if (!initialized) {
      initializeFromMockData();
    }
  }, [initialized, initializeFromMockData]);

  // 获取所有单词的详细信息
  const getAllWordDetails = () => {
    try {
      const allWordStates = [
        ...(redWords || []),
        ...(yellowWords || []),
        ...(greenWords || [])
      ];
      
      if (allWordStates.length === 0) {
        console.log('No word states found, store may not be initialized');
        return [];
      }
      
      const uniqueWordIds = [...new Set(allWordStates.map(w => w.wordId))];
      const wordDetails = uniqueWordIds.map(wordId => getWordById(wordId)).filter(Boolean);
      
      console.log('Word details loaded:', wordDetails.length, 'words');
      return wordDetails;
    } catch (error) {
      console.error('Error getting word details:', error);
      return [];
    }
  };

  const allWordDetails = getAllWordDetails();
  
  // 生成符合 lexicon-matrix 格式的单词数据
  const words = useMemo(() => {
    if (!allWordDetails || allWordDetails.length === 0) {
      return [];
    }
    return generateMockWords(allWordDetails, redWords, yellowWords, greenWords);
  }, [allWordDetails, redWords, yellowWords, greenWords]);

  // 计算统计数量
  const counts = useMemo(() => {
    return words.reduce((acc, word) => {
      acc[word.status] = (acc[word.status] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    }, { all: 0 });
  }, [words]);

  // 生成排行榜数据
  const leaderboardStudents = useMemo(() => {
    const stats = {
      masteredCount: counts[WordStatus.MASTERED] || 0,
      totalWords: counts.all || 0,
    };
    return generateMockLeaderboard(stats);
  }, [counts]);

  // 筛选选项
  const filterOptions = useMemo(() => [
    { id: 'all', label: '全部', count: counts.all, colorClass: 'bg-slate-400' },
    { id: WordStatus.NEEDS_WORK, label: '待攻坚', count: counts[WordStatus.NEEDS_WORK] || 0, colorClass: 'bg-rose-500' },
    { id: WordStatus.REVIEWING, label: '复习中', count: counts[WordStatus.REVIEWING] || 0, colorClass: 'bg-amber-500' },
    { id: WordStatus.MASTERED, label: '已精通', count: counts[WordStatus.MASTERED] || 0, colorClass: 'bg-emerald-500' },
  ], [counts]);

  // 过滤单词
  const filteredWords = useMemo(() => {
    let result = words;
    if (activeFilter !== 'all') {
      result = result.filter(w => w.status === activeFilter);
    }
    if (searchTerm) {
      result = result.filter(w => 
        w.vocabulary.toLowerCase().includes(searchTerm.toLowerCase()) || 
        w.meaning.includes(searchTerm)
      );
    }
    return result;
  }, [activeFilter, searchTerm, words]);

  const openMatrix = () => {
    setView('matrix');
  };

  const scrollToLeaderboard = () => {
    // 移除滚动功能
  };

  const goBack = () => {
    setView('dashboard');
  };

  // 如果未初始化，显示加载状态
  if (!initialized) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-[#F9FAFF]">
        <SimpleHeader title="单词库" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <p>加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 调试信息
  console.log('WordLibrary render:', {
    initialized,
    wordsCount: words.length,
    redWords: redWords?.length || 0,
    yellowWords: yellowWords?.length || 0,
    greenWords: greenWords?.length || 0,
    counts
  });

  return (
    <div className="h-screen flex flex-col font-sans bg-[#F9FAFF] relative overflow-hidden">
      <SimpleHeader title="单词库" />

      <main className="word-library-container flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {/* --- VIEW 1: MAIN DASHBOARD --- */}
        <div className={`transition-all duration-700 ease-in-out ${view === 'dashboard' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none absolute w-full'}`}>
          <div className="mb-10 px-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white shadow-xl rotate-3">
                <Boxes size={28} />
              </div>
              <div>
                <h1 className="text-[44px] font-black text-slate-900 tracking-tighter leading-none">单词库</h1>
                <p className="text-slate-400 font-bold text-sm mt-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-400 animate-pulse" />
                  点击"词汇量"查看全量矩阵
                </p>
              </div>
            </div>
          </div>

          {words.length > 0 ? (
            <MasteryDashboard 
              words={words} 
              onVocabularyClick={openMatrix}
              onRankClick={scrollToLeaderboard}
              isMatrixVisible={view === 'matrix'}
            />
          ) : (
            <div className="bg-white rounded-[3rem] p-10 shadow-soft border border-slate-50 text-center">
              <p className="text-slate-400">暂无单词数据，请先学习一些单词</p>
            </div>
          )}

          {/* Leaderboard Section */}
          <div ref={leaderboardRef} className="mt-8">
            <LeaderboardPage students={leaderboardStudents} />
          </div>
        </div>

        {/* --- VIEW 2: WORD MATRIX (SECONDARY PAGE) --- */}
        <div className={`transition-all duration-700 ease-in-out ${view === 'matrix' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none absolute w-full'}`}>
          <div className="mb-8 flex items-center gap-4">
            <button 
              onClick={goBack}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">单词全次元库</h2>
          </div>

          <div className="bg-white rounded-[3.5rem] shadow-soft border border-slate-50 p-8 sm:p-14 overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-lg">
                  <Database size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">矩阵详情</h2>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Lexicon Records 2.0</p>
                </div>
              </div>

              <div className="flex-1 max-w-md relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="检索您的词汇记忆..."
                  className="w-full bg-slate-50 border-2 border-transparent rounded-full py-4 pl-14 pr-6 font-bold text-slate-700 placeholder-slate-300 focus:outline-none focus:bg-white focus:border-indigo-100 transition-all shadow-inner"
                />
              </div>
            </div>

            <FilterChips 
              options={filterOptions} 
              activeFilter={activeFilter} 
              onFilterChange={setActiveFilter} 
            />
            
            <div className="mt-12">
              {filteredWords.length > 0 ? (
                <WordTable words={filteredWords} />
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <p>没有找到匹配的单词</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      <FooterStats counts={counts} />
    </div>
  );
};

export default WordLibrary;
