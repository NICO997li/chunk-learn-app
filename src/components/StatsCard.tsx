import { Flame, BookOpen, CheckCircle, Clock, TrendingUp, Target } from 'lucide-react';
import { LearningStats } from '@/types';

interface StatsCardProps {
  stats: LearningStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const learnedProgress = stats.totalChunks > 0
    ? (stats.learnedChunks / stats.totalChunks) * 100
    : 0;
  const masteredProgress = stats.totalChunks > 0
    ? (stats.masteredChunks / stats.totalChunks) * 100
    : 0;

  return (
    <div className="w-full max-w-md mx-auto px-2 space-y-4 animate-fade-in-up pb-4">
      {/* 顶部标题 */}
      <div className="px-2 pt-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-cool flex items-center justify-center shadow-glow-secondary">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-display-en text-2xl font-bold text-textPrimary">Stats</h2>
        </div>
        <p className="text-sm text-textSecondary font-medium pl-11">
          看看你的学习进度
        </p>
      </div>

      {/* 核心数据卡 - 大胆配色 */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="relative overflow-hidden rounded-clay p-4 text-center text-white shadow-glow-primary"
          style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 100%)' }}>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl" />
          <p className="font-display-en text-3xl font-bold leading-none">{stats.totalChunks}</p>
          <p className="text-[11px] font-bold mt-1 opacity-95">总语块</p>
        </div>
        <div className="relative overflow-hidden rounded-clay p-4 text-center text-white shadow-glow-secondary"
          style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #6BCBE7 100%)' }}>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl" />
          <p className="font-display-en text-3xl font-bold leading-none">{stats.learnedChunks}</p>
          <p className="text-[11px] font-bold mt-1 opacity-95">已学过</p>
        </div>
        <div className="relative overflow-hidden rounded-clay p-4 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #A78BFA 0%, #C8B6FF 100%)', boxShadow: '0 8px 24px rgba(167,139,250,0.35)' }}>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl" />
          <p className="font-display-en text-3xl font-bold leading-none">{stats.masteredChunks}</p>
          <p className="text-[11px] font-bold mt-1 opacity-95">已掌握</p>
        </div>
      </div>

      {/* 进度条 */}
      <div className="glass rounded-clay p-4 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-textPrimary flex items-center gap-1.5">
              <span>📖</span> 学习进度
            </span>
            <span className="font-display-en text-sm font-bold text-secondaryDark">
              {learnedProgress.toFixed(1)}%
            </span>
          </div>
          <div className="h-3 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
              style={{
                width: `${Math.max(learnedProgress, 0.5)}%`,
                background: 'linear-gradient(90deg, #4ECDC4 0%, #6BCBE7 100%)',
              }}
            >
              <div className="absolute inset-0 bg-shimmer animate-shimmer" />
            </div>
          </div>
          <p className="text-[10px] text-textSecondary mt-1 font-medium">
            已学过 = 至少学过 1 次的语块
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-textPrimary flex items-center gap-1.5">
              <span>🏆</span> 掌握进度
            </span>
            <span className="font-display-en text-sm font-bold text-ctaDark">
              {masteredProgress.toFixed(1)}%
            </span>
          </div>
          <div className="h-3 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
              style={{
                width: `${Math.max(masteredProgress, 0.5)}%`,
                background: 'linear-gradient(90deg, #A78BFA 0%, #C8B6FF 100%)',
              }}
            >
              <div className="absolute inset-0 bg-shimmer animate-shimmer" />
            </div>
          </div>
          <p className="text-[10px] text-textSecondary mt-1 font-medium">
            已掌握 = 复习间隔达到 21 天以上
          </p>
        </div>
      </div>

      {/* 详细统计 - 4 格 */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="glass rounded-clay p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-display-en text-xl font-bold text-textPrimary leading-none">
              {stats.todayReviews}
            </p>
            <p className="text-[11px] font-bold text-textSecondary mt-1">今日已学</p>
          </div>
        </div>

        <div className="glass rounded-clay p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="font-display-en text-xl font-bold text-textPrimary leading-none">
              {stats.streak}<span className="text-sm">天</span>
            </p>
            <p className="text-[11px] font-bold text-textSecondary mt-1">连续学习</p>
          </div>
        </div>

        <div className="glass rounded-clay p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cta/15 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-ctaDark" />
          </div>
          <div>
            <p className="font-display-en text-xl font-bold text-textPrimary leading-none">
              {stats.totalReviews}
            </p>
            <p className="text-[11px] font-bold text-textSecondary mt-1">总复习</p>
          </div>
        </div>

        <div className="glass rounded-clay p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-secondaryDark" />
          </div>
          <div>
            <p className="font-display-en text-xl font-bold text-textPrimary leading-none">
              {stats.totalChunks - stats.learnedChunks}
            </p>
            <p className="text-[11px] font-bold text-textSecondary mt-1">待学</p>
          </div>
        </div>
      </div>

      {/* SM-2 说明 */}
      <div className="rounded-clay p-4" style={{
        background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.12) 0%, rgba(167, 139, 250, 0.12) 100%)',
      }}>
        <p className="text-sm font-bold text-textPrimary mb-2 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-secondary" />
          智能复习节奏（SM-2 算法）
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <span className="text-textSecondary">😵 完全忘了 → <strong className="text-textPrimary">1 天后</strong></span>
          <span className="text-textSecondary">🤔 有点难 → <strong className="text-textPrimary">3 天后</strong></span>
          <span className="text-textSecondary">😊 记得 → <strong className="text-textPrimary">7 天后</strong></span>
          <span className="text-textSecondary">🚀 轻松 → <strong className="text-textPrimary">14 天后</strong></span>
        </div>
      </div>
    </div>
  );
}
