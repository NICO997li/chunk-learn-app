import { LearningRecord, LearningStats } from '@/types';

const RECORDS_KEY = 'chunk-learn-records';
const STATS_KEY = 'chunk-learn-stats';

/**
 * 保存学习记录到 localStorage
 */
export function saveLearningRecords(records: LearningRecord[]): void {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to save learning records:', error);
  }
}

/**
 * 从 localStorage 加载学习记录
 */
export function loadLearningRecords(): LearningRecord[] {
  try {
    const data = localStorage.getItem(RECORDS_KEY);
    if (!data) return [];
    
    const records = JSON.parse(data);
    // 转换日期字符串为Date对象
    return records.map((record: any) => ({
      ...record,
      lastReviewDate: new Date(record.lastReviewDate),
      nextReviewDate: new Date(record.nextReviewDate),
    }));
  } catch (error) {
    console.error('Failed to load learning records:', error);
    return [];
  }
}

/**
 * 保存学习统计
 */
export function saveLearningStats(stats: LearningStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save learning stats:', error);
  }
}

/**
 * 加载学习统计
 */
export function loadLearningStats(): LearningStats | null {
  try {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load learning stats:', error);
    return null;
  }
}

/**
 * 清除所有学习数据
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(RECORDS_KEY);
    localStorage.removeItem(STATS_KEY);
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}
