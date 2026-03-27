// 语块数据类型（匹配 chunks.json 250个语块的格式）
export interface Chunk {
  id: number;
  chunk: string;             // 语块文本（英文）
  translation: string;       // 中文翻译
  example: string;           // 完整例句
  exampleCN: string;         // 例句中文翻译
  scenario: string;          // 场景分类
  difficulty: string;        // 难度等级
  tags: string[];            // 标签
}

// 学习记录
export interface LearningRecord {
  chunkId: number;
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
