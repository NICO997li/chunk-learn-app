// 语块数据类型
export interface Chunk {
  id: string;
  text: string; // 4-8个单词的语块
  translation: string; // 中文翻译
  targetWord: string; // 目标单词
  example: string; // 完整例句
  exampleTranslation: string; // 例句翻译
  audio?: string; // 语音文件URL
  category: ChunkCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// 语块分类
export type ChunkCategory = 
  | 'daily-life'      // 日常生活
  | 'work'            // 工作场景
  | 'travel'          // 旅行
  | 'study'           // 学习
  | 'social'          // 社交
  | 'business';       // 商务

// 学习记录
export interface LearningRecord {
  chunkId: string;
  status: 'new' | 'learning' | 'mastered';
  reviewCount: number;
  lastReviewDate: Date;
  nextReviewDate: Date;
  easeFactor: number; // SM-2算法的难度因子
  interval: number; // 复习间隔(天)
}

// 用户学习统计
export interface LearningStats {
  totalChunks: number;
  masteredChunks: number;
  learningChunks: number;
  todayReviews: number;
  streak: number; // 连续学习天数
  totalReviews: number;
}

// 复习队列项
export interface ReviewQueueItem {
  chunk: Chunk;
  record: LearningRecord;
}

// 用户反馈(复习时)
export type ReviewFeedback = 'again' | 'hard' | 'good' | 'easy';
