import { Trophy, Target, Flame, BookOpen } from 'lucide-react';
import { LearningStats } from '@/types';

interface StatsCardProps {
  stats: LearningStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const statItems = [
    {
      icon: BookOpen,
      label: '总词块',
      value: stats.totalChunks,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Target,
      label: '学习中',
      value: stats.learningChunks,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: Trophy,
      label: '已掌握',
      value: stats.masteredChunks,
      color: 'text-cta',
      bgColor: 'bg-cta/10',
    },
    {
      icon: Flame,
      label: '连续学习',
      value: `${stats.streak}天`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  const progress = stats.totalChunks > 0 
    ? (stats.masteredChunks / stats.totalChunks) * 100 
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-clay-lg p-6 shadow-clay-lg">
        <h2 className="text-2xl font-heading font-bold text-textPrimary mb-6 text-center">
          学习统计
        </h2>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-body text-textPrimary/70">总体进度</span>
            <span className="text-sm font-body font-bold text-primary">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="h-4 bg-background rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 统计项 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center p-4 bg-background rounded-clay shadow-clay"
              >
                <div className={`${item.bgColor} p-3 rounded-clay mb-3`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="text-2xl font-heading font-bold text-textPrimary mb-1">
                  {item.value}
                </div>
                <div className="text-xs font-body text-textPrimary/60 text-center">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* 今日复习 */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-clay">
          <div className="flex items-center justify-between">
            <span className="font-body text-textPrimary/70">今日已复习</span>
            <span className="text-xl font-heading font-bold text-primary">
              {stats.todayReviews} 个语块
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
