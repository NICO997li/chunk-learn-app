import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, off } from 'firebase/database';
import { UserLearningData } from '@/types';

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
      if (!firebaseConfig.apiKey) {
        console.warn('Firebase 未配置，云同步功能不可用');
        return null;
      }
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
export function syncUserData(data: UserLearningData): void {
  const database = getFirebaseDB();
  if (!database) return;
  
  try {
    const userRef = ref(database, `users/${data.userId}`);
    set(userRef, {
      ...data,
      // 序列化日期
      records: data.records.map(r => ({
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
 * 监听所有用户的学习数据变化
 */
export function listenAllUsers(callback: (users: UserLearningData[]) => void): () => void {
  const database = getFirebaseDB();
  if (!database) {
    callback([]);
    return () => {};
  }
  
  const usersRef = ref(database, 'users');
  
  const unsubscribe = onValue(usersRef, (snapshot) => {
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
  }, (error) => {
    console.error('监听数据失败:', error);
    callback([]);
  });
  
  // 返回取消监听函数
  return () => off(usersRef);
}

/**
 * 检查 Firebase 是否已配置
 */
export function isFirebaseConfigured(): boolean {
  return !!firebaseConfig.apiKey;
}
