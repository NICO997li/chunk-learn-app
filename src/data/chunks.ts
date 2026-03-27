import { Chunk } from '@/types';
import chunksJson from './chunks.json';

// 从 JSON 文件加载全部 250 个语块
export const chunkData: Chunk[] = chunksJson as Chunk[];

// 从数据中提取所有场景分类
export const scenarios: string[] = [...new Set(chunkData.map((c) => c.scenario))];

// 从数据中提取所有难度等级
export const difficulties: string[] = [...new Set(chunkData.map((c) => c.difficulty))];

// 难度等级对应的显示名（直接使用中文，因为 JSON 数据已经是中文了）
export const difficultyNames: Record<string, string> = {
  '入门': '入门',
  '初级': '初级',
  '中级': '中级',
  '高级': '高级',
};
