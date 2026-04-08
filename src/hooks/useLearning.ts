import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { LearningRecord, LearningStats, ReviewFeedback, ReviewQueueItem } from '@/types';
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
  saveLearningStats,
  getCurrentUser,
} from '@/utils/storage';
import { syncUserData } from '@/utils/firebase';

// 洗牌函数
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useLearning() {
  const [records, setRecords] = useState<LearningRecord[]>([]);
  const [stats, setStats] = useState<LearningStats>({
    totalChunks: chunkData.length,
    learnedChunks: 0,
    masteredChunks: 0,
    learningChunks: 0,
    todayReviews: 0,
    streak: 0,
    totalReviews: 0,
  });

  // 当前学习模式：'new' 新学 / 'review' 复习
  const [mode, setMode] = useState<'new' | 'review'>('new');
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
      const existingIds = new Set(savedRecords.map(r => r.chunkId));
      const newChunks = chunkData.filter(c => !existingIds.has(c.id));
      
      if (newChunks.length > 0) {
        const newRecords = newChunks.map(chunk => initializeLearningRecord(chunk.id));
        const mergedRecords = [...savedRecords, ...newRecords];
        setRecords(mergedRecords);
        saveLearningRecords(mergedRecords);
      } else {
        setRecords(savedRecords);
      }
    } else {
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

  // 计算待复习数量（已学过且到期的）
  const dueReviewCount = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return records.filter((r) => {
      if (r.reviewCount === 0) return false; // 没学过的不算复习
      const nextReview = new Date(r.nextReviewDate);
      nextReview.setHours(0, 0, 0, 0);
      return nextReview <= now;
    }).length;
  }, [records]);

  // 计算新学数量（还没学过且到期的）
  const newLearnCount = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return records.filter((r) => {
      if (r.reviewCount > 0) return false; // 学过的不算新学
      const nextReview = new Date(r.nextReviewDate);
      nextReview.setHours(0, 0, 0, 0);
      return nextReview <= now;
    }).length;
  }, [records]);

  // 更新统计数据 + 云同步
  useEffect(() => {
    const masteredCount = records.filter((r) => r.status === 'mastered').length;
    const learnedCount = records.filter((r) => r.reviewCount > 0).length;
    const notLearnedCount = records.filter((r) => r.reviewCount === 0).length;

    const totalReviewsCount = records.reduce(
      (sum, record) => sum + record.reviewCount,
      0
    );

    const streakCount = calculateStreak(records);

    const newStats: LearningStats = {
      totalChunks: chunkData.length,
      learnedChunks: learnedCount,
      masteredChunks: masteredCount,
      learningChunks: notLearnedCount,
      todayReviews: todayLearnedCount,
      streak: streakCount,
      totalReviews: totalReviewsCount,
    };

    setStats(newStats);
    saveLearningStats(newStats);

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

  // 构建新学队列
  const buildNewQueue = useCallback(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 只取没学过的语块
    const newRecords = records.filter((r) => {
      if (r.reviewCount > 0) return false;
      const nextReview = new Date(r.nextReviewDate);
      nextReview.setHours(0, 0, 0, 0);
      return nextReview <= now;
    });

    const shuffled = shuffle(newRecords).slice(0, dailyGoal);

    const queue: ReviewQueueItem[] = shuffled.map((record) => ({
      chunk: chunkData.find((c) => c.id === record.chunkId)!,
      record,
    })).filter(item => item.chunk != null);

    setMode('new');
    setReviewQueue(queue);
    setCurrentReview(queue.length > 0 ? queue[0] : null);
  }, [records, dailyGoal]);

  // 构建复习队列
  const buildReviewQueue = useCallback(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // 只取学过且到期的语块
    const dueRecords = records.filter((r) => {
      if (r.reviewCount === 0) return false;
      const nextReview = new Date(r.nextReviewDate);
      nextReview.setHours(0, 0, 0, 0);
      return nextReview <= now;
    });

    const shuffled = shuffle(dueRecords).slice(0, dailyGoal);

    const queue: ReviewQueueItem[] = shuffled.map((record) => ({
      chunk: chunkData.find((c) => c.id === record.chunkId)!,
      record,
    })).filter(item => item.chunk != null);

    setMode('review');
    setReviewQueue(queue);
    setCurrentReview(queue.length > 0 ? queue[0] : null);
  }, [records, dailyGoal]);

  // 首次加载时自动构建新学队列
  const queueInitialized = useRef(false);
  useEffect(() => {
    if (records.length > 0 && !queueInitialized.current) {
      queueInitialized.current = true;
      buildNewQueue();
    }
  }, [records, buildNewQueue]);

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

      const newQueue = reviewQueue.slice(1);
      setReviewQueue(newQueue);
      setCurrentReview(newQueue.length > 0 ? newQueue[0] : null);
    },
    [currentReview, records, reviewQueue]
  );

  // 开始新学
  const startNewSession = useCallback(() => {
    buildNewQueue();
  }, [buildNewQueue]);

  // 开始复习
  const startReviewSession = useCallback(() => {
    buildReviewQueue();
  }, [buildReviewQueue]);

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
    mode,
    reviewQueue,
    currentReview,
    submitReview,
    startNewSession,
    startReviewSession,
    getTodayLearned,
    dailyGoal,
    saveDailyGoal,
    todayLearnedCount,
    dueReviewCount,
    newLearnCount,
    hasNewLearns: newLearnCount > 0,
    hasReviews: dueReviewCount > 0,
  };
}
