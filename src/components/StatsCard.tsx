import { Trophy, Target, Flame, BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { LearningStats } from '@/types';

interface StatsCardProps {
  stats: LearningStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const progress = stats.totalChunks > 0 
    ? (stats.masteredChunks / stats.totalChunks) * 100 
    : 0;

  // 已学过的（至少复习过1次的）= 已掌握 + 学习中（非new状态）
  const learnedCount = stats.masteredChunks + (stats.totalChunks - stats.learningChunks - stats.masteredChunks > 0 ? stats.totalChunks - stats.learningChunks : 0);
  
  // 未学过的 = learning状态中status为new的
  const newCount = stats.learningChunks;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 overflow-y-auto">
      <div className="bg-white rounded-clay-lg p-5 shadow-clay-lg">
        <h2 className="text-xl font-heading font-bold text-textPrimary mb-4 text-center">
          学习统计
        </h2>

        {/* 核心数据 - 大字展示 */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-clay p-4 mb-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-heading font-bold text-primary">{stats.totalChunks}</p>
              <p className="text-xs font-body text-textPrimary/60">总语块数</p>
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-cta">{stats.masteredChunks}</p>
              <p className="text-xs font-body text-textPrimary/60">已掌握</p>
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-secondary">{stats.learningChunks}</p>
              <p className="text-xs font-body text-textPrimary/60">待学习</p>
            </div>
          </div>
        </div>

        {/* 总体进度条 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm font-body font-bold text-textPrimary">总体掌握进度</span>
            <span className="text-lg font-heading font-bold text-primary">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="h-4 bg-background rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 relative"
              style={{ width: `${Math.max(progress, 1)}%` }}
            >
              {progress > 8 && (
                <span className="absolute right-2 top-0 h-full flex items-center text-[10px] text-white font-bold">
                  {progress.toFixed(0)}%
                </span>
              )}
            </div>
          </div>
          <p className="text-xs font-body text-textPrimary/50 mt-1 text-center">
            已掌握 {stats.masteredChunks} / {stats.totalChunks} 个语块
          </p>
        </div>

        {/* 详细统计 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-3 p-3 bg-background rounded-clay">
            <div className="bg-primary/10 p-2 rounded-clay">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-lg font-heading font-bold text-textPrimary">
                {stats.todayReviews}
              </div>
              <div className="text-xs font-body text-textPrimary/60">今日已学</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background rounded-clay">
            <div className="bg-orange-500/10 p-2 rounded-clay">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="text-lg font-heading font-bold text-textPrimary">
                {stats.streak}天
              </div>
              <div className="text-xs font-body text-textPrimary/60">连续学习</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background rounded-clay">
            <div className="bg-cta/10 p-2 rounded-clay">
              <CheckCircle className="w-5 h-5 text-cta" />
            </div>
            <div>
              <div className="text-lg font-heading font-bold text-textPrimary">
                {stats.totalReviews}
              </div>
              <div className="text-xs font-body text-textPrimary/60">总复习次数</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background rounded-clay">
            <div className="bg-secondary/10 p-2 rounded-clay">
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="text-lg font-heading font-bold text-textPrimary">
                {stats.totalChunks - stats.masteredChunks}
              </div>
              <div className="text-xs font-body text-textPrimary/60">待攻克</div>
            </div>
          </div>
        </div>

        {/* SM-2 算法说明 */}
        <div className="bg-blue-50 rounded-clay p-3">
          <p className="text-xs font-body font-bold text-blue-700 mb-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            智能复习机制（SM-2算法）
          </p>
          <div className="grid grid-cols-2 gap-1 text-xs font-body text-blue-600">
            <span>完全忘记 → 1天后复习</span>
            <span>有点难 → 约3天后</span>
            <span>记得 → 约7天后</span>
            <span>轻松 → 约14天后</span>
          </div>
          <p className="text-[10px] font-body text-blue-500 mt-1">
            到期语块会自动出现在学习队列中，无需手动操作
          </p>
        </div>
      </div>
    </div>
  );
}
