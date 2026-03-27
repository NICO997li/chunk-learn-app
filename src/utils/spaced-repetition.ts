import { LearningRecord, ReviewFeedback } from '@/types';

/**
 * SM-2间隔重复算法
 * 根据用户反馈计算下次复习时间和难度因子
 */
export function calculateNextReview(
  record: LearningRecord,
  feedback: ReviewFeedback
): LearningRecord {
  const now = new Date();
  let { easeFactor, interval, reviewCount } = record;

  // 根据反馈调整难度因子
  switch (feedback) {
    case 'again':
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      interval = 1; // 重新开始
      break;
    case 'hard':
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      interval = Math.max(1, Math.floor(interval * 1.2));
      break;
    case 'good':
      if (reviewCount === 0) {
        interval = 1;
      } else if (reviewCount === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      break;
    case 'easy':
      easeFactor = Math.min(2.5, easeFactor + 0.15);
      if (reviewCount === 0) {
        interval = 4;
      } else {
        interval = Math.round(interval * easeFactor * 1.3);
      }
      break;
  }

  // 计算下次复习日期
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  // 确定状态
  let status: LearningRecord['status'] = 'learning';
  if (feedback === 'again') {
    status = 'new';
  } else if (interval >= 21 && easeFactor >= 2.0) {
    status = 'mastered';
  }

  return {
    ...record,
    status,
    reviewCount: reviewCount + 1,
    lastReviewDate: now,
    nextReviewDate,
    easeFactor,
    interval,
  };
}

/**
 * 获取今天到期的复习项目
 */
export function getDueReviews(records: LearningRecord[]): LearningRecord[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return records.filter((record) => {
    const nextReview = new Date(record.nextReviewDate);
    nextReview.setHours(0, 0, 0, 0);
    return nextReview <= now;
  });
}

/**
 * 初始化新语块的学习记录
 */
export function initializeLearningRecord(chunkId: number): LearningRecord {
  const now = new Date();
  return {
    chunkId,
    status: 'new',
    reviewCount: 0,
    lastReviewDate: now,
    nextReviewDate: now,
    easeFactor: 2.5,
    interval: 0,
  };
}

/**
 * 计算连续学习天数
 */
export function calculateStreak(records: LearningRecord[]): number {
  if (records.length === 0) return 0;

  const sortedDates = records
    .map((r) => {
      const date = new Date(r.lastReviewDate);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .sort((a, b) => b - a);

  const uniqueDates = [...new Set(sortedDates)];
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let currentDate = today.getTime();

  for (const date of uniqueDates) {
    if (date === currentDate) {
      streak++;
      currentDate -= 24 * 60 * 60 * 1000; // 前一天
    } else if (date < currentDate) {
      break;
    }
  }

  return streak;
}
