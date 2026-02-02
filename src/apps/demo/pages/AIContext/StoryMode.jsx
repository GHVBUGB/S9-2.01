import React, { useState } from 'react';
import { Volume2, CheckCircle } from 'lucide-react';
import WordTooltip from './WordTooltip';
import { getWordById } from '../../../../shared/data/mockWords';
import './StoryMode.css';

/**
 * 故事精读模式组件 - 支持两篇故事和问答
 */
const StoryMode = ({ storyData, words, onFinish }) => {
  const [currentStory, setCurrentStory] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const story = storyData.stories[currentStory];

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentStory < storyData.stories.length - 1) {
      setCurrentStory(currentStory + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onFinish();
    }
  };

  return (
    <div className="story-mode">
      <div className="story-header">
        <div className="header-info">
          <span className="story-subtitle">{story.group}</span>
          <h2 className="story-title">{story.title}</h2>
        </div>
        <button 
          onClick={() => playAudio(story.content.map(p => typeof p === 'string' ? p : p.text).join(' '))}
          className={`audio-btn ${isPlaying ? 'playing' : ''}`}
        >
          <Volume2 className={`audio-icon ${isPlaying ? 'pulse' : ''}`} />
        </button>
      </div>

      <article className="story-article">
        {story.content.map((part, i) => {
          if (typeof part === 'string') return <span key={i} className="story-text">{part}</span>;
          // 直接通过 getWordById 获取单词，不依赖 words prop
          const wordObj = getWordById(part.wordId);
          return wordObj ? <WordTooltip key={i} word={wordObj}>{part.text}</WordTooltip> : <span key={i}>{part.text}</span>;
        })}
      </article>

      <div className="story-question">
        <h3 className="question-title">[Check Q]: {story.question}</h3>
        <div className="question-options">
          {story.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`option-button ${
                selectedAnswer === index ? 
                  (index === story.correctAnswer ? 'correct' : 'incorrect') 
                  : ''
              }`}
            >
              {option}
              {showResult && index === story.correctAnswer && (
                <CheckCircle className="check-icon" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="story-footer">
        {showResult ? (
          <button onClick={handleNext} className="finish-btn">
            {currentStory < storyData.stories.length - 1 ? '下一篇故事 →' : '完成阅读'}
          </button>
        ) : (
          <div className="story-progress">
            Story {currentStory + 1} / {storyData.stories.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryMode;
