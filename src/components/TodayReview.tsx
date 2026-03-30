import { Eye, Clock } from 'lucide-react';
import { ReviewQueueItem } from '@/types';
import { ReadAloud } from './ReadAloud';

interface TodayReviewProps {
  todayChunks: ReviewQueueItem[];
}

export function TodayReview({ todayChunks }: TodayReviewProps) {
  if (todayChunks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-heading font-bold text-primary mb-2">今日回看</h2>
        <p className="font-body text-textPrimary/60">今天还没有学习记录</p>
        <p className="font-body text-sm text-textPrimary/40 mt-2">开始学习后，你学过的语块会出现在这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
          <Eye className="w-6 h-6" />
          今日回看
        </h2>
        <span className="font-body text-sm text-textPrimary/60">
          共学习了 {todayChunks.length} 个语块
        </span>
      </div>

      <div className="space-y-3">
        {todayChunks.map(({ chunk, record }) => (
          <div
            key={chunk.id}
            className="bg-white rounded-clay p-4 shadow-clay hover:shadow-clay-pressed transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-heading font-bold text-primary">
                    {chunk.chunk}
                  </span>
                  <span
                    className={`
                      px-2 py-0.5 rounded-full text-xs font-body font-bold
                      ${
                        record.status === 'mastered'
                          ? 'bg-green-100 text-green-700'
                          : record.status === 'learning'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    {record.status === 'mastered'
                      ? '已掌握'
                      : record.status === 'learning'
                      ? '学习中'
                      : '新学习'}
                  </span>
                </div>
                <p className="font-body text-sm text-textPrimary/70 mb-2">
                  {chunk.translation}
                </p>
                <p className="font-body text-sm text-textPrimary/60 italic">
                  &ldquo;{chunk.example}&rdquo;
                </p>
                <p className="font-body text-xs text-textPrimary/40 mt-1">
                  {chunk.exampleCN}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 text-xs font-body text-textPrimary/50">
                  <Clock className="w-3 h-3" />
                  {new Date(record.lastReviewDate).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <span className="text-xs font-body text-textPrimary/50">
                  复习 {record.reviewCount} 次
                </span>
                <div onClick={(e) => e.stopPropagation()}>
                  <ReadAloud text={chunk.chunk} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
