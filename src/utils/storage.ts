import { LearningRecord, LearningStats, UserProfile } from '@/types';

// 用户相关 key
const CURRENT_USER_KEY = 'chunk-learn-current-user';
const ALL_USERS_KEY = 'chunk-learn-all-users';

// 获取当前用户的存储 key 前缀
function getUserPrefix(): string {
  const user = getCurrentUser();
  return user ? `chunk-learn-${user.id}` : 'chunk-learn';
}

// ======== 用户管理 ========

/**
 * 获取当前登录用户
 */
export function getCurrentUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * 设置当前用户
 */
export function setCurrentUser(user: UserProfile): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

/**
 * 获取所有已注册的用户
 */
export function getAllUsers(): UserProfile[] {
  try {
    const data = localStorage.getItem(ALL_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 添加新用户
 */
export function addUser(user: UserProfile): void {
  const users = getAllUsers();
  // 避免重复
  if (!users.find(u => u.id === user.id)) {
    users.push(user);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
  }
}

/**
 * 生成唯一用户ID
 */
export function generateUserId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

/**
 * 退出登录（切换用户）
 */
export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// ======== 学习数据存储（按用户隔离） ========

/**
 * 保存学习记录到 localStorage
 */
export function saveLearningRecords(records: LearningRecord[]): void {
  try {
    const key = `${getUserPrefix()}-records`;
    localStorage.setItem(key, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to save learning records:', error);
  }
}

/**
 * 从 localStorage 加载学习记录
 */
export function loadLearningRecords(): LearningRecord[] {
  try {
    const key = `${getUserPrefix()}-records`;
    const data = localStorage.getItem(key);
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
    const key = `${getUserPrefix()}-stats`;
    localStorage.setItem(key, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save learning stats:', error);
  }
}

/**
 * 加载学习统计
 */
export function loadLearningStats(): LearningStats | null {
  try {
    const key = `${getUserPrefix()}-stats`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load learning stats:', error);
    return null;
  }
}

/**
 * 清除当前用户所有学习数据
 */
export function clearAllData(): void {
  try {
    const prefix = getUserPrefix();
    localStorage.removeItem(`${prefix}-records`);
    localStorage.removeItem(`${prefix}-stats`);
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}

/**
 * 删除指定用户（从本地用户列表和学习数据中移除）
 */
export function deleteUser(userId: string): void {
  try {
    // 从用户列表中删除
    const users = getAllUsers().filter(u => u.id !== userId);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
    
    // 删除该用户的学习数据
    localStorage.removeItem(`chunk-learn-${userId}-records`);
    localStorage.removeItem(`chunk-learn-${userId}-stats`);
    localStorage.removeItem(`dailyGoal-${userId}`);
    
    // 如果删除的是当前用户，退出登录
    const current = getCurrentUser();
    if (current && current.id === userId) {
      logoutUser();
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
}

/**
 * 用云端数据恢复本地存储（跨设备登录）
 */
export function restoreFromCloud(userId: string, records: any[], dailyGoal: number): void {
  try {
    const key = `chunk-learn-${userId}`;
    localStorage.setItem(`${key}-records`, JSON.stringify(records));
    localStorage.setItem(`dailyGoal-${userId}`, String(dailyGoal));
  } catch (error) {
    console.error('Failed to restore from cloud:', error);
  }
}
