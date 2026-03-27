import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, remove, onValue, off } from 'firebase/database';
import { UserLearningData, LearningRecord } from '@/types';

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyBllb2MTj7rvgMNzU9EU5xg7y4JRgq3djg",
  authDomain: "meihoo-chunk-learn2.firebaseapp.com",
  databaseURL: "https://meihoo-chunk-learn2-default-rtdb.firebaseio.com",
  projectId: "meihoo-chunk-learn2",
  storageBucket: "meihoo-chunk-learn2.firebasestorage.app",
  messagingSenderId: "755565352691",
  appId: "1:755565352691:web:ece175704d6818e9350986"
};

let app: any = null;
let db: any = null;

function getFirebaseDB() {
  if (!db) {
    try {
      app = initializeApp(firebaseConfig);
      db = getDatabase(app);
    } catch (e) {
      console.error('Firebase 初始化失败:', e);
      return null;
    }
  }
  return db;
}

/**
 * 同步用户学习数据到云端
 */
export async function syncUserData(data: UserLearningData): Promise<void> {
  const database = getFirebaseDB();
  if (!database) return;
  
  try {
    const userRef = ref(database, `users/${data.userId}`);
    await set(userRef, {
      ...data,
      records: data.records.map((r: LearningRecord) => ({
        ...r,
        lastReviewDate: new Date(r.lastReviewDate).toISOString(),
        nextReviewDate: new Date(r.nextReviewDate).toISOString(),
      })),
      lastSyncAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error('同步数据失败:', e);
  }
}

/**
 * 从云端拉取指定用户的学习数据
 * 用于跨设备登录时恢复数据
 */
export async function fetchUserData(userId: string): Promise<UserLearningData | null> {
  const database = getFirebaseDB();
  if (!database) return null;

  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) return null;

    const data = snapshot.val();
    return {
      ...data,
      records: (data.records || []).map((r: any) => ({
        ...r,
        lastReviewDate: new Date(r.lastReviewDate),
        nextReviewDate: new Date(r.nextReviewDate),
      })),
    };
  } catch (e) {
    console.error('拉取数据失败:', e);
    return null;
  }
}

/**
 * 通过用户名查找云端用户（用于跨设备登录）
 */
export async function findUserByName(name: string): Promise<UserLearningData | null> {
  const database = getFirebaseDB();
  if (!database) return null;

  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) return null;

    const allData = snapshot.val();
    for (const userId of Object.keys(allData)) {
      const userData = allData[userId];
      if (userData.userName === name) {
        return {
          ...userData,
          records: (userData.records || []).map((r: any) => ({
            ...r,
            lastReviewDate: new Date(r.lastReviewDate),
            nextReviewDate: new Date(r.nextReviewDate),
          })),
        };
      }
    }
    return null;
  } catch (e) {
    console.error('查找用户失败:', e);
    return null;
  }
}

/**
 * 删除云端用户数据
 */
export async function deleteUserFromCloud(userId: string): Promise<void> {
  const database = getFirebaseDB();
  if (!database) return;

  try {
    const userRef = ref(database, `users/${userId}`);
    await remove(userRef);
  } catch (e) {
    console.error('删除云端数据失败:', e);
  }
}

/**
 * 监听所有用户的学习数据变化（实时）
 */
export function listenAllUsers(callback: (users: UserLearningData[]) => void): () => void {
  const database = getFirebaseDB();
  if (!database) {
    callback([]);
    return () => {};
  }
  
  const usersRef = ref(database, 'users');
  
  const unsubscribe = onValue(usersRef, (snapshot: any) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    
    const users: UserLearningData[] = Object.values(data).map((userData: any) => ({
      ...userData,
      records: (userData.records || []).map((r: any) => ({
        ...r,
        lastReviewDate: new Date(r.lastReviewDate),
        nextReviewDate: new Date(r.nextReviewDate),
      })),
    }));
    
    callback(users);
  }, (error: any) => {
    console.error('监听数据失败:', error);
    callback([]);
  });
  
  return () => off(usersRef);
}
