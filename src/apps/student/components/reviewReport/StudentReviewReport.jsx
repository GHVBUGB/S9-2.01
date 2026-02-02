/**
 * 学生端 - 每日复习报告
 * 课程结束时弹出的报告组件
 */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from './components/Layout/PageContainer';
import { ScrollReveal } from './components/Animation/ScrollReveal';
import { MascotAvatar } from './components/Student/MascotAvatar';
import { Share2, ChevronDown, X, TrendingUp, TrendingDown, Home } from 'lucide-react';
import { mockReviewReport } from './mockData';
import './reviewReport.css';

export const StudentReviewReport = ({ data = mockReviewReport, onClose }) => {
  const navigate = useNavigate();
  const [selectedWord, setSelectedWord] = useState(null);
  const passPercent = Math.round((data.overview.review_pass_count / data.overview.total_review_count) * 100);
  const failPercent = 100 - passPercent;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto">
      <div className="min-h-screen w-full">
        {/* 标题页 */}
        <PageContainer isCover className="justify-start pt-8 pb-4 relative overflow-hidden">
          <header className="flex justify-between items-start z-20 relative">
            <ScrollReveal delay={100}>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">每日复习报告</span>
                <span className="font-serif font-bold text-lg text-black">{data.metadata.review_date}</span>
              </div>
            </ScrollReveal>
            <div className="flex gap-2">
              <ScrollReveal delay={200}>
                <button className="glass-card p-2.5 rounded-full border border-white/50 shadow-sm active:scale-95 transition-transform">
                  <Share2 className="w-4 h-4 text-gray-700" />
                </button>
              </ScrollReveal>
              {onClose && (
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/');
                  }}
                  className="glass-card p-2.5 rounded-full border border-white/50 shadow-sm active:scale-95 transition-transform hover:bg-gray-50"
                  title="关闭并返回首页"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              )}
            </div>
          </header>

          <div className="flex-1 flex flex-col justify-start relative z-10 mt-20">
            <ScrollReveal className="flex flex-col items-center mb-10">
              <div className="relative mb-6 mt-8">
                <div className="absolute -top-10 -right-20 z-20 animate-in fade-in zoom-in duration-500 delay-300">
                  <div className="bg-[#1a1a1a] text-white px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] relative">
                    <span className="text-[11px] font-bold whitespace-nowrap">{data.metadata.student_name}今日复习表现出色 ⭐</span>
                    <div className="absolute -bottom-1.5 left-0 w-3 h-3 bg-[#1a1a1a] transform rotate-45"></div>
                  </div>
                </div>

                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center relative">
                  <MascotAvatar className="w-[180%] h-[180%] -mt-2" />
                </div>
              </div>
              
              <div className="text-center mt-2">
                <h1 className="text-4xl font-black text-gray-900 font-serif tracking-tight mb-2">
                  {data.metadata.student_name}
                </h1>
                <p className="text-gray-400 text-[10px] font-bold tracking-[0.25em] uppercase">
                  S9 单词复习报告
                </p>
              </div>
            </ScrollReveal>

            {/* 学生信息 */}
            <ScrollReveal delay={300} className="mb-6">
              <div className="glass-card p-5 rounded-[1.25rem] shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] border border-white/50">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">学生</span>
                    <span className="font-bold text-gray-900">{data.metadata.student_name}</span>
                    <span className="text-gray-400 ml-1 text-[10px]">({data.metadata.student_id})</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">授课教师</span>
                    <span className="font-bold text-gray-900">{data.metadata.teacher_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">复习时段</span>
                    <span className="font-bold text-gray-900">{data.metadata.review_time}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-1">课程类型</span>
                    <span className="font-bold text-purple-600">{data.metadata.course_type}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* 复习概览 */}
            <div className="flex flex-col gap-3 mb-2">
              <ScrollReveal delay={400} className="glass-card glass-card-hover p-5 rounded-[1.25rem] shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] border border-white/50 relative overflow-hidden flex items-center justify-between h-28">
                <div className="flex flex-col justify-between h-full py-1 relative z-10">
                  <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">复习词数</div>
                  <div className="text-[9px] font-bold text-white bg-black/90 px-2.5 py-1 rounded-full w-fit">今日复习</div>
                </div>
                <div className="relative z-10 text-right">
                  <div className="text-5xl font-serif font-black leading-none mb-1 text-gray-900">
                    {data.overview.total_review_count}
                    <span className="text-lg font-medium text-gray-400 ml-1 font-sans">词</span>
                  </div>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-2 gap-3">
                <ScrollReveal delay={500} className="glass-card glass-card-hover p-5 rounded-[1.25rem] shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] border border-white/50 flex flex-col justify-between h-24">
                  <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">复习时长</div>
                  <div>
                    <div className="text-2xl font-serif font-black text-gray-900 leading-none mb-1">{data.overview.review_duration}</div>
                    <div className="text-[10px] font-bold text-gray-400">分钟</div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={600} className="glass-card glass-card-hover p-5 rounded-[1.25rem] shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] border border-white/50 flex flex-col justify-between h-24">
                  <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">通过率</div>
                  <div>
                    <div className="text-2xl font-serif font-black text-gray-900 leading-none mb-1">{data.overview.review_pass_rate.toFixed(0)}%</div>
                    <div className="text-[10px] font-bold text-blue-600">{data.overview.review_pass_count}词通过</div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>

          <ScrollReveal delay={800} className="absolute bottom-4 left-0 right-0 flex justify-center opacity-30">
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </ScrollReveal>
        </PageContainer>

        {/* 通过率分布 */}
        <PageContainer>
          <ScrollReveal className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black font-serif">复习成果</h2>
              <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wide">今日</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="glass-card p-6 rounded-[1.25rem] shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] border border-white/50">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-serif font-black text-gray-900">{data.overview.total_review_count}词</span>
                <span className="text-xs text-gray-500">通过 {data.overview.review_pass_count}词 · 失败 {data.overview.review_fail_count}词</span>
              </div>
              
              <div className="flex gap-2 h-12 rounded-xl overflow-hidden">
                <div 
                  className="bg-green-600 flex items-center justify-center text-white text-sm font-bold"
                  style={{ width: `${passPercent}%` }}
                >
                  通过 {passPercent}%
                </div>
                <div 
                  className="bg-red-600 flex items-center justify-center text-white text-sm font-bold"
                  style={{ width: `${failPercent}%` }}
                >
                  失败 {failPercent}%
                </div>
              </div>
            </div>
          </ScrollReveal>
        </PageContainer>

        {/* AI复习总结 */}
        <PageContainer>
          <ScrollReveal className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black font-serif">AI复习总结</h2>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            <ScrollReveal delay={100}>
              <div className="glass-card p-5 rounded-[1.25rem] shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] border border-white/50">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">复习总结</div>
                <p className="text-sm text-gray-800 leading-relaxed">{data.ai_content.ai_review_summary}</p>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <div className="glass-card p-5 rounded-[1.25rem] shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] border border-white/50">
                <div className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-2">鼓励语</div>
                <p className="text-sm text-gray-800 leading-relaxed">{data.ai_content.ai_encouragement}</p>
              </div>
            </ScrollReveal>
            
            {data.ai_content.ai_weak_words && data.ai_content.ai_weak_words.length > 0 && (
              <ScrollReveal delay={300}>
                <div className="glass-card p-5 rounded-[1.25rem] shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] border border-white/50">
                  <div className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mb-3">薄弱词</div>
                  <div className="flex flex-wrap gap-2">
                    {data.ai_content.ai_weak_words.map((word, idx) => (
                      <span key={idx} className="px-3 py-1.5 glass-card rounded-full text-sm font-bold text-gray-800 border border-yellow-200">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
            
            <ScrollReveal delay={400}>
              <div className="glass-card p-5 rounded-[1.25rem] shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] border border-white/50">
                <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-2">复习建议</div>
                <p className="text-sm text-gray-800 leading-relaxed">{data.ai_content.ai_suggestion}</p>
              </div>
            </ScrollReveal>
          </div>
        </PageContainer>

        {/* 返回首页按钮 */}
        <PageContainer>
          <ScrollReveal delay={500} className="mb-8">
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => {
                  if (onClose) onClose();
                  navigate('/');
                }}
                className="glass-card px-8 py-4 rounded-[1.5rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] border border-white/50 flex items-center gap-3 hover:shadow-lg transition-all active:scale-95"
              >
                <Home className="w-5 h-5 text-gray-700" />
                <span className="text-base font-bold text-gray-900">返回首页</span>
              </button>
              <p className="text-xs text-gray-400 text-center">
                点击返回首页或关闭按钮退出报告
              </p>
            </div>
          </ScrollReveal>
        </PageContainer>
      </div>

      {/* 单词详情模态框 */}
      {selectedWord && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedWord(null)}
          ></div>
          <div className="glass-card w-full max-w-sm rounded-[2rem] p-6 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-white/50">
            <button 
              onClick={() => setSelectedWord(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <span className="text-2xl font-serif font-black">{selectedWord.word.charAt(0).toUpperCase()}</span>
              </div>
              <h2 className="text-3xl font-serif font-black text-gray-900 mb-1">{selectedWord.word}</h2>
              <div className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full mb-6">
                Day {selectedWord.review_day} · {selectedWord.track_type === 'fast' ? '快车道' : '标准车道'}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>,
    document.body
  );
};

export default StudentReviewReport;
