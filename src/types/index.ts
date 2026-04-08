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
  learnedChunks: number;   // 已学过（至少复习过1次）
  masteredChunks: number;  // 已掌握（SM-2算法判定）
  learningChunks: number;  // 待学习（还没学过的）
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

// 用户档案
export interface UserProfile {
  id: string;           // 用户唯一ID（自动生成）
  name: string;         // 用户昵称
  avatar: string;       // 头像（emoji）
  createdAt: string;    // 创建时间
}

// 云端同步的学习数据
export interface UserLearningData {
  userId: string;
  userName: string;
  userAvatar: string;
  records: LearningRecord[];
  stats: LearningStats;
  dailyGoal: number;
  lastSyncAt: string;   // 最后同步时间
}
