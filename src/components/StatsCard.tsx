import { Trophy, Target, Flame, BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { LearningStats } from '@/types';

interface StatsCardProps {
  stats: LearningStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  // 总体进度 = 已学过/总数
  const learnedProgress = stats.totalChunks > 0 
    ? (stats.learnedChunks / stats.totalChunks) * 100 
    : 0;

  // 掌握进度 = 已掌握/总数
  const masteredProgress = stats.totalChunks > 0
    ? (stats.masteredChunks / stats.totalChunks) * 100
    : 0;

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
              <p className="text-xs font-body text-textPrimary/60">总语块</p>
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-secondary">{stats.learnedChunks}</p>
              <p className="text-xs font-body text-textPrimary/60">已学过</p>
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-cta">{stats.masteredChunks}</p>
              <p className="text-xs font-body text-textPrimary/60">已掌握</p>
            </div>
          </div>
        </div>

        {/* 学习进度条 */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-body font-bold text-textPrimary">学习进度</span>
            <span className="text-sm font-heading font-bold text-secondary">
              {stats.learnedChunks} / {stats.totalChunks}（{learnedProgress.toFixed(1)}%）
            </span>
          </div>
          <div className="h-3 bg-background rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${Math.max(learnedProgress, 0.5)}%` }}
            />
          </div>
          <p className="text-[10px] font-body text-textPrimary/40 mt-0.5">
            已学过 = 至少做过1次的语块
          </p>
        </div>

        {/* 掌握进度条 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-body font-bold text-textPrimary">掌握进度</span>
            <span className="text-sm font-heading font-bold text-cta">
              {stats.masteredChunks} / {stats.totalChunks}（{masteredProgress.toFixed(1)}%）
            </span>
          </div>
          <div className="h-3 bg-background rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cta to-green-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(masteredProgress, 0.5)}%` }}
            />
          </div>
          <p className="text-[10px] font-body text-textPrimary/40 mt-0.5">
            已掌握 = 复习间隔达到21天以上
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
                {stats.totalChunks - stats.learnedChunks}
              </div>
              <div className="text-xs font-body text-textPrimary/60">未学过</div>
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
