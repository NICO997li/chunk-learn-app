import { Eye, Clock, Sparkles } from 'lucide-react';
import { ReviewQueueItem } from '@/types';
import { ReadAloud } from './ReadAloud';

interface TodayReviewProps {
  todayChunks: ReviewQueueItem[];
}

export function TodayReview({ todayChunks }: TodayReviewProps) {
  if (todayChunks.length === 0) {
    return (
      <div className="text-center py-12 max-w-md mx-auto px-4 animate-fade-in-up">
        <div className="text-7xl mb-4 animate-float">📚</div>
        <h2 className="font-display-en text-3xl font-bold text-gradient-warm mb-2">
          Today's Review
        </h2>
        <p className="font-bold text-textPrimary mb-1">今日还没学习呀</p>
        <p className="text-sm text-textSecondary">
          开始学习后，你学过的语块都会出现在这里
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 animate-fade-in-up">
      {/* 标题 */}
      <div className="px-2 pt-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-warm flex items-center justify-center shadow-glow-primary">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-display-en text-2xl font-bold text-textPrimary">
              Today
            </h2>
          </div>
          <div className="px-3 py-1 bg-gradient-warm rounded-full">
            <span className="text-xs font-bold text-white">
              {todayChunks.length} 个
            </span>
          </div>
        </div>
        <p className="text-sm text-textSecondary font-medium pl-11">
          今天学过的语块都在这儿啦
        </p>
      </div>

      {/* 语块列表 */}
      <div className="space-y-3 pb-4">
        {todayChunks.map(({ chunk, record }, idx) => {
          const statusInfo = record.status === 'mastered'
            ? { label: '已掌握', emoji: '🏆', bg: 'bg-cta/15', text: 'text-ctaDark' }
            : record.status === 'learning'
            ? { label: '学习中', emoji: '📖', bg: 'bg-secondary/15', text: 'text-secondaryDark' }
            : { label: '新学', emoji: '✨', bg: 'bg-accent/30', text: 'text-orange-700' };

          return (
            <div
              key={chunk.id}
              className="glass rounded-clay p-4 hover:shadow-clay transition-all"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display-en text-lg font-bold text-textPrimary leading-tight mb-0.5 break-words">
                    {chunk.chunk}
                  </h3>
                  <p className="text-sm font-medium text-textPrimary/80">
                    {chunk.translation}
                  </p>
                </div>
                <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                  <ReadAloud text={chunk.chunk} />
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-2.5 mb-2">
                <p className="text-xs italic text-textPrimary/70 leading-relaxed">
                  &ldquo;{chunk.example}&rdquo;
                </p>
                <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">
                  {chunk.exampleCN}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 ${statusInfo.bg} ${statusInfo.text} rounded-full text-[11px] font-bold flex items-center gap-1`}>
                  <span>{statusInfo.emoji}</span>
                  {statusInfo.label}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-textSecondary font-medium">
                  <span className="flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" />
                    {record.reviewCount}次
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(record.lastReviewDate).toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
