import { useState, useEffect, useRef } from 'react';
import { Trophy, Target, Flame, BookOpen, Crown, Share2, TrendingUp } from 'lucide-react';
import { UserLearningData } from '@/types';
import { listenAllUsers } from '@/utils/firebase';
import { getCurrentUser } from '@/utils/storage';

export function Dashboard() {
  const [allUsers, setAllUsers] = useState<UserLearningData[]>([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const unsubscribe = listenAllUsers((users) => {
      // 按今日学习数量排序
      const sorted = users.sort((a, b) => {
        const todayA = getTodayCount(a);
        const todayB = getTodayCount(b);
        return todayB - todayA;
      });
      setAllUsers(sorted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const currentUser = getCurrentUser();

  // 计算某用户今日学习数量
  function getTodayCount(userData: UserLearningData): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (userData.records || []).filter((r) => {
      if (r.reviewCount === 0) return false;
      const lastReview = new Date(r.lastReviewDate);
      lastReview.setHours(0, 0, 0, 0);
      return lastReview.getTime() === today.getTime();
    }).length;
  }

  // 生成分享报告图片
  const generateReport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 600;
    const height = 400 + allUsers.length * 80;
    canvas.width = width;
    canvas.height = height;

    // 背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#4F46E5');
    gradient.addColorStop(1, '#818CF8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 标题
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📊 MeihooStudy 学习报告', width / 2, 50);

    // 日期
    ctx.font = '16px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(new Date().toLocaleDateString('zh-CN', { 
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
    }), width / 2, 80);

    // 白色卡片背景
    const cardY = 100;
    const cardHeight = height - 130;
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, 20, cardY, width - 40, cardHeight, 16);
    ctx.fill();

    // 排行标题
    ctx.fillStyle = '#312E81';
    ctx.font = 'bold 20px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🏆 学习排行榜', 50, cardY + 40);

    // 每个用户数据
    allUsers.forEach((user, index) => {
      const y = cardY + 70 + index * 80;
      const todayCount = getTodayCount(user);
      const isCurrentUser = currentUser?.id === user.userId;
      
      // 排名背景
      if (index === 0) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
        roundRect(ctx, 40, y - 10, width - 80, 70, 12);
        ctx.fill();
      }

      // 排名
      ctx.fillStyle = index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32';
      ctx.font = 'bold 24px "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(index < 3 ? ['🥇', '🥈', '🥉'][index] : `${index + 1}`, 70, y + 30);

      // 头像+名字
      ctx.font = '24px "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(user.userAvatar || '😊', 100, y + 30);
      
      ctx.fillStyle = isCurrentUser ? '#4F46E5' : '#312E81';
      ctx.font = `${isCurrentUser ? 'bold ' : ''}18px "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.fillText(user.userName + (isCurrentUser ? ' (我)' : ''), 135, y + 28);

      // 统计数据
      ctx.font = '14px "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.fillStyle = '#6B7280';
      ctx.fillText(
        `今日 ${todayCount} 个 · 已掌握 ${user.stats?.masteredChunks || 0} / ${user.stats?.totalChunks || 250} · 连续 ${user.stats?.streak || 0} 天`,
        135, y + 50
      );

      // 进度条
      const progress = user.stats ? (user.stats.masteredChunks / user.stats.totalChunks) * 100 : 0;
      ctx.fillStyle = '#EEF2FF';
      roundRect(ctx, width - 160, y + 15, 100, 10, 5);
      ctx.fill();
      ctx.fillStyle = '#4F46E5';
      roundRect(ctx, width - 160, y + 15, Math.max(progress, 2), 10, 5);
      ctx.fill();
      ctx.fillStyle = '#4F46E5';
      ctx.font = 'bold 12px "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${progress.toFixed(0)}%`, width - 50, y + 25);
    });

    // 底部水印
    ctx.fillStyle = 'rgba(49, 46, 129, 0.3)';
    ctx.font = '12px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MeihooStudy · meihoo语块学习', width / 2, height - 20);

    // 下载图片
    const link = document.createElement('a');
    link.download = `meihoo-study-report-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4 animate-pulse">📊</div>
        <p className="font-body text-textPrimary/60">加载中...</p>
      </div>
    );
  }

  if (allUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-2xl font-heading font-bold text-primary mb-2">学习看板</h2>
        <p className="font-body text-textPrimary/60">暂无数据</p>
        <p className="font-body text-sm text-textPrimary/40 mt-2">
          开始学习后，数据会自动同步到这里
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 py-2 px-4 overflow-y-auto">
      {/* 隐藏的canvas用于生成报告 */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* 标题 + 分享按钮 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          学习看板
        </h2>
        <button
          onClick={generateReport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm font-body font-bold rounded-clay shadow-clay hover:shadow-clay-pressed transition-all duration-200 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          分享报告
        </button>
      </div>

      {/* 用户排行 */}
      <div className="space-y-3">
        {allUsers.map((user, index) => {
          const todayCount = getTodayCount(user);
          const isCurrentUser = currentUser?.id === user.userId;
          const progress = user.stats 
            ? (user.stats.masteredChunks / user.stats.totalChunks) * 100 
            : 0;

          return (
            <div
              key={user.userId}
              className={`
                bg-white rounded-clay p-4 shadow-clay transition-all duration-200
                ${isCurrentUser ? 'ring-2 ring-primary/50' : ''}
                ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-white' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                {/* 排名 */}
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  {index === 0 ? (
                    <Crown className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <span className="text-lg font-heading font-bold text-textPrimary/40">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* 头像 */}
                <span className="text-2xl flex-shrink-0">{user.userAvatar || '😊'}</span>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-textPrimary truncate">
                      {user.userName}
                    </span>
                    {isCurrentUser && (
                      <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-body font-bold">
                        我
                      </span>
                    )}
                  </div>
                  
                  {/* 进度条 */}
                  <div className="mt-1.5">
                    <div className="h-1.5 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* 数据 */}
                  <div className="flex items-center gap-3 mt-1.5 text-xs font-body text-textPrimary/50">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      今日 {todayCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      掌握 {user.stats?.masteredChunks || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      连续 {user.stats?.streak || 0} 天
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 最后同步时间 */}
      <p className="text-center text-xs font-body text-textPrimary/30 pb-2">
        数据实时同步 · 开始学习后自动更新
      </p>
    </div>
  );
}

// Canvas 圆角矩形辅助函数
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
