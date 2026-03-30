import { useState, useEffect, useCallback, useMemo } from 'react';
import { LearningRecord, LearningStats, ReviewFeedback, ReviewQueueItem, UserProfile } from '@/types';
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
  getCurrentUser,
} from '@/utils/storage';
import { syncUserData } from '@/utils/firebase';

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
  
  // 每日学习目标（按用户隔离）
  const [dailyGoal, setDailyGoal] = useState<number>(() => {
    const user = getCurrentUser();
    const key = user ? `dailyGoal-${user.id}` : 'dailyGoal';
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : 10;
  });

  // 加载数据
  useEffect(() => {
    const savedRecords = loadLearningRecords();

    if (savedRecords.length > 0) {
      // 检查是否有新增的语块（数据源更新后）
      const existingIds = new Set(savedRecords.map(r => r.chunkId));
      const newChunks = chunkData.filter(c => !existingIds.has(c.id));
      
      if (newChunks.length > 0) {
        // 为新语块创建初始记录
        const newRecords = newChunks.map(chunk => initializeLearningRecord(chunk.id));
        const mergedRecords = [...savedRecords, ...newRecords];
        setRecords(mergedRecords);
        saveLearningRecords(mergedRecords);
      } else {
        setRecords(savedRecords);
      }
    } else {
      // 初始化所有语块的记录
      const initialRecords = chunkData.map((chunk) =>
        initializeLearningRecord(chunk.id)
      );
      setRecords(initialRecords);
      saveLearningRecords(initialRecords);
    }
  }, []);

  // 计算今日已学习数量
  const todayLearnedCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return records.filter((r) => {
      if (r.reviewCount === 0) return false;
      const lastReview = new Date(r.lastReviewDate);
      lastReview.setHours(0, 0, 0, 0);
      return lastReview.getTime() === today.getTime();
    }).length;
  }, [records]);

  // 更新统计数据 + 云同步
  useEffect(() => {
    const masteredCount = records.filter((r) => r.status === 'mastered').length;
    const learningCount = records.filter(
      (r) => r.status === 'learning' || r.status === 'new'
    ).length;

    const totalReviewsCount = records.reduce(
      (sum, record) => sum + record.reviewCount,
      0
    );

    const streakCount = calculateStreak(records);

    const newStats: LearningStats = {
      totalChunks: chunkData.length,
      masteredChunks: masteredCount,
      learningChunks: learningCount,
      todayReviews: todayLearnedCount,
      streak: streakCount,
      totalReviews: totalReviewsCount,
    };

    setStats(newStats);
    saveLearningStats(newStats);

    // 云同步：每次数据变化时同步到 Firebase
    const user = getCurrentUser();
    if (user && records.length > 0) {
      syncUserData({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        records,
        stats: newStats,
        dailyGoal,
        lastSyncAt: new Date().toISOString(),
      });
    }
  }, [records, todayLearnedCount, dailyGoal]);

  // 更新复习队列（限制每日学习量）
  const updateReviewQueue = useCallback(() => {
    const dueRecords = getDueReviews(records);
    
    // 限制为每日目标数量
    const limitedRecords = dueRecords.slice(0, dailyGoal);
    
    const queue: ReviewQueueItem[] = limitedRecords.map((record) => ({
      chunk: chunkData.find((c) => c.id === record.chunkId)!,
      record,
    })).filter(item => item.chunk != null);
    
    setReviewQueue(queue);

    if (queue.length > 0 && !currentReview) {
      setCurrentReview(queue[0]);
    }
  }, [records, currentReview, dailyGoal]);

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
        }))
        .filter(item => item.chunk != null);
    },
    [records]
  );

  // 获取今日学习的语块
  const getTodayLearned = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return records
      .filter((r) => {
        if (r.reviewCount === 0) return false;
        const lastReview = new Date(r.lastReviewDate);
        lastReview.setHours(0, 0, 0, 0);
        return lastReview.getTime() === today.getTime();
      })
      .map((record) => ({
        chunk: chunkData.find((c) => c.id === record.chunkId)!,
        record,
      }))
      .filter(item => item.chunk != null)
      .sort((a, b) => {
        return new Date(b.record.lastReviewDate).getTime() - new Date(a.record.lastReviewDate).getTime();
      });
  }, [records]);

  // 保存每日目标
  const saveDailyGoal = useCallback((goal: number) => {
    setDailyGoal(goal);
    const user = getCurrentUser();
    const key = user ? `dailyGoal-${user.id}` : 'dailyGoal';
    localStorage.setItem(key, String(goal));
  }, []);

  return {
    stats,
    reviewQueue,
    currentReview,
    submitReview,
    startNewSession,
    getChunksByStatus,
    getTodayLearned,
    dailyGoal,
    saveDailyGoal,
    todayLearnedCount,
    hasReviews: reviewQueue.length > 0,
  };
}
