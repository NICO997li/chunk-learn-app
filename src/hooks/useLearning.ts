import { useState, useEffect, useCallback } from 'react';
import { Chunk, LearningRecord, LearningStats, ReviewFeedback, ReviewQueueItem } from '@/types';
import { chunkData } from '@/data/chunks';
import {
  calculateNextReview,
  getDueReviews,
  initializeLearningRecord,
  calculateStreak,
} from '@/utils/spaced-repetition';
import {
  loadLearningRecords,
  saveLearningRecords,
  loadLearningStats,
  saveLearningStats,
} from '@/utils/storage';

export function useLearning() {
  const [records, setRecords] = useState<LearningRecord[]>([]);
  const [stats, setStats] = useState<LearningStats>({
    totalChunks: chunkData.length,
    masteredChunks: 0,
    learningChunks: 0,
    todayReviews: 0,
    streak: 0,
    totalReviews: 0,
  });
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>([]);
  const [currentReview, setCurrentReview] = useState<ReviewQueueItem | null>(null);

  // 加载数据
  useEffect(() => {
    const savedRecords = loadLearningRecords();
    const savedStats = loadLearningStats();

    if (savedRecords.length > 0) {
      setRecords(savedRecords);
    } else {
      // 初始化所有语块的记录
      const initialRecords = chunkData.map((chunk) =>
        initializeLearningRecord(chunk.id)
      );
      setRecords(initialRecords);
      saveLearningRecords(initialRecords);
    }

    if (savedStats) {
      setStats(savedStats);
    }
  }, []);

  // 更新统计数据
  useEffect(() => {
    const masteredCount = records.filter((r) => r.status === 'mastered').length;
    const learningCount = records.filter(
      (r) => r.status === 'learning' || r.status === 'new'
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReviewsCount = records.filter((r) => {
      const lastReview = new Date(r.lastReviewDate);
      lastReview.setHours(0, 0, 0, 0);
      return lastReview.getTime() === today.getTime();
    }).length;

    const totalReviewsCount = records.reduce(
      (sum, record) => sum + record.reviewCount,
      0
    );

    const streakCount = calculateStreak(records);

    const newStats: LearningStats = {
      totalChunks: chunkData.length,
      masteredChunks: masteredCount,
      learningChunks: learningCount,
      todayReviews: todayReviewsCount,
      streak: streakCount,
      totalReviews: totalReviewsCount,
    };

    setStats(newStats);
    saveLearningStats(newStats);
  }, [records]);

  // 更新复习队列
  const updateReviewQueue = useCallback(() => {
    const dueRecords = getDueReviews(records);
    const queue: ReviewQueueItem[] = dueRecords.map((record) => ({
      chunk: chunkData.find((c) => c.id === record.chunkId)!,
      record,
    }));
    setReviewQueue(queue);

    if (queue.length > 0 && !currentReview) {
      setCurrentReview(queue[0]);
    }
  }, [records, currentReview]);

  useEffect(() => {
    updateReviewQueue();
  }, [updateReviewQueue]);

  // 提交复习反馈
  const submitReview = useCallback(
    (feedback: ReviewFeedback) => {
      if (!currentReview) return;

      const updatedRecord = calculateNextReview(currentReview.record, feedback);
      const newRecords = records.map((r) =>
        r.chunkId === updatedRecord.chunkId ? updatedRecord : r
      );

      setRecords(newRecords);
      saveLearningRecords(newRecords);

      // 移到下一个
      const newQueue = reviewQueue.slice(1);
      setReviewQueue(newQueue);
      setCurrentReview(newQueue.length > 0 ? newQueue[0] : null);
    },
    [currentReview, records, reviewQueue]
  );

  // 开始新一轮学习
  const startNewSession = useCallback(() => {
    updateReviewQueue();
  }, [updateReviewQueue]);

  // 获取指定状态的语块
  const getChunksByStatus = useCallback(
    (status: LearningRecord['status']) => {
      return records
        .filter((r) => r.status === status)
        .map((record) => ({
          chunk: chunkData.find((c) => c.id === record.chunkId)!,
          record,
        }));
    },
    [records]
  );

  return {
    stats,
    reviewQueue,
    currentReview,
    submitReview,
    startNewSession,
    getChunksByStatus,
    hasReviews: reviewQueue.length > 0,
  };
}
