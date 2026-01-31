import { WordStatus } from './types';

// Mock words data - will be replaced with actual data from store
export const generateMockWords = (words, redWords, yellowWords, greenWords) => {
  return words.map(word => {
    let status = WordStatus.NEEDS_WORK;
    let reviewCount = 0;
    
    if (greenWords?.some(w => w.wordId === word.id)) {
      status = WordStatus.MASTERED;
      const greenWord = greenWords.find(w => w.wordId === word.id);
      reviewCount = greenWord?.reviewCount || 4;
    } else if (yellowWords?.some(w => w.wordId === word.id)) {
      status = WordStatus.REVIEWING;
      const yellowWord = yellowWords.find(w => w.wordId === word.id);
      reviewCount = yellowWord?.reviewCount || 2;
    } else if (redWords?.some(w => w.wordId === word.id)) {
      status = WordStatus.NEEDS_WORK;
      const redWord = redWords.find(w => w.wordId === word.id);
      reviewCount = redWord?.errorCount || 1;
    }
    
    return {
      id: word.id,
      vocabulary: word.word || '',
      meaning: word.meaning?.chinese || word.meaning?.definitionCn || word.meaning?.english || '',
      instance: word.context?.[0]?.sentence || word.context?.[0]?.sentenceCn || '',
      status: status,
      reviewCount: Math.min(reviewCount, 4), // 0-4 scale
    };
  });
};

// Generate mock leaderboard students
const generateMockStudents = (count, currentUserStats) => {
  const firstNames = ['Zhang', 'Li', 'Wang', 'Zhao', 'Sun', 'Zhou', 'Wu', 'Zheng', 'Feng', 'Chen'];
  const lastNames = ['Wei', 'Min', 'Fang', 'Qiang', 'Jun', 'Lei', 'Ting', 'Yang', 'Bin', 'Yan'];
  
  const students = [
    { 
      id: 'me', 
      name: 'Me', 
      masteredCount: currentUserStats?.masteredCount || 0, 
      totalWords: currentUserStats?.totalWords || 0, 
      isCurrentUser: true 
    }
  ];

  for (let i = 1; i < count; i++) {
    const f = firstNames[Math.floor(Math.random() * firstNames.length)];
    const l = lastNames[Math.floor(Math.random() * lastNames.length)];
    students.push({
      id: `s${i}`,
      name: `${f} ${l}`,
      masteredCount: Math.floor(Math.random() * 10),
      totalWords: currentUserStats?.totalWords || 9,
      isCurrentUser: false
    });
  }
  return students;
};

export const generateMockLeaderboard = (currentUserStats) => {
  return generateMockStudents(100, currentUserStats);
};

