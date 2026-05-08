import { useState, useEffect } from 'react';
import { Home, BookOpen, BarChart3, Eye, TrendingUp, LogOut, Trash2, AlertTriangle, Flame, Sparkles, Zap } from 'lucide-react';
import { useLearning } from '@/hooks/useLearning';
import { ChunkCard } from '@/components/ChunkCard';
import { ReviewButtons } from '@/components/ReviewButtons';
import { StatsCard } from '@/components/StatsCard';
import { DailyGoalSetting } from '@/components/DailyGoalSetting';
import { TodayReview } from '@/components/TodayReview';
import { UserSelect } from '@/components/UserSelect';
import { Dashboard } from '@/components/Dashboard';
import { BrushLogo } from '@/components/BrushLogo';
import { UserProfile } from '@/types';
import { getCurrentUser, logoutUser, deleteUser } from '@/utils/storage';
import { deleteUserFromCloud } from '@/utils/firebase';

type View = 'home' | 'review' | 'today' | 'stats' | 'dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const handleUserSelected = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-5xl animate-bounce-soft">📚</div>
      </div>
    );
  }

  if (!currentUser) {
    return <UserSelect onUserSelected={handleUserSelected} />;
  }

  return <MainApp currentUser={currentUser} onLogout={handleLogout} />;
}

function MainApp({ currentUser, onLogout }: { currentUser: UserProfile; onLogout: () => void }) {
  const [currentView, setCurrentView] = useState<View>('home');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    stats,
    mode,
    currentReview,
    submitReview,
    startNewSession,
    startReviewSession,
    hasNewLearns,
    hasReviews,
    getTodayLearned,
    dailyGoal,
    saveDailyGoal,
    todayLearnedCount,
    dueReviewCount,
    newLearnCount,
  } = useLearning();

  const handleDeleteAccount = async () => {
    deleteUser(currentUser.id);
    try {
      await deleteUserFromCloud(currentUser.id);
    } catch (e) {
      console.error('删除云端数据失败:', e);
    }
    onLogout();
  };

  const progressPercent = Math.min((todayLearnedCount / dailyGoal) * 100, 100);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="w-full max-w-md mx-auto space-y-5 py-4 animate-fade-in-up">
            {/* 顶部用户信息栏 */}
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-warm flex items-center justify-center text-2xl shadow-glow-primary">
                  {currentUser.avatar}
                </div>
                <div>
                  <p className="text-xs text-textSecondary font-medium">Hi 👋</p>
                  <p className="font-bold text-textPrimary text-base leading-tight">
                    {currentUser.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <DailyGoalSetting currentGoal={dailyGoal} onSave={saveDailyGoal} />
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2.5 glass rounded-2xl btn-press"
                  title="删除账号"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-2.5 glass rounded-2xl btn-press"
                  title="切换用户"
                >
                  <LogOut className="w-4 h-4 text-textSecondary" />
                </button>
              </div>
            </div>

            {/* 删除确认弹窗 */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
                <div className="bg-white rounded-clay-xl shadow-clay-lg max-w-sm w-full p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-textPrimary text-lg">删除账号</h3>
                      <p className="text-sm text-textSecondary">
                        确定删除 <strong>{currentUser.name}</strong> 的所有数据？
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-red-500 mb-4 bg-red-50 p-3 rounded-xl">
                    ⚠️ 此操作不可恢复，本地和云端数据都将被删除！
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-3 bg-gray-100 text-textPrimary font-bold rounded-2xl hover:bg-gray-200 btn-press"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 py-3 bg-red-500 text-white font-bold rounded-2xl shadow-lg hover:bg-red-600 btn-press"
                    >
                      确认删除
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 主标题 - 手绘蜡笔 logo */}
            <div className="text-center px-4 pt-2 relative">
              {/* 装饰小元素 */}
              <span className="absolute top-0 left-1/4 text-2xl animate-float-slow opacity-70">✨</span>
              <span className="absolute -top-1 right-1/4 text-2xl animate-float opacity-70" style={{ animationDelay: '1s' }}>🎈</span>
              <span className="absolute top-12 left-6 text-xl animate-pulse-soft opacity-60">⭐</span>
              <span className="absolute top-12 right-6 text-xl animate-pulse-soft opacity-60" style={{ animationDelay: '0.5s' }}>💫</span>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 backdrop-blur-sm rounded-full mb-3 shadow-soft">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse-soft" />
                <span className="text-xs font-bold text-textPrimary">让英语脱口而出</span>
              </div>

              <BrushLogo size="lg" className="mb-2 drop-shadow-sm" />

              <p className="text-sm text-textSecondary font-medium mt-1">
                语块记忆法 · 用固定搭配像母语者一样说英语
              </p>
            </div>

            {/* 今日进度卡 - 大胆的渐变 */}
            <div className="px-4">
              <div className="relative overflow-hidden rounded-clay-xl p-5 shadow-clay-lg" style={{
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 50%, #FFD93D 100%)',
              }}>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/15 rounded-full blur-2xl" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center">
                        <Flame className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-white/90 font-bold uppercase tracking-wider">Today</p>
                        <p className="text-white font-bold">今日学习</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display-en text-3xl font-bold text-white leading-none">
                        {todayLearnedCount}
                        <span className="text-lg opacity-80">/{dailyGoal}</span>
                      </p>
                    </div>
                  </div>

                  <div className="h-2.5 bg-white/25 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500 relative overflow-hidden"
                      style={{ width: `${progressPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-shimmer animate-shimmer" />
                    </div>
                  </div>

                  <p className="text-xs text-white/90 mt-2 font-medium">
                    {progressPercent >= 100
                      ? '🎉 已完成今日目标，再接再厉！'
                      : `还差 ${dailyGoal - todayLearnedCount} 个就达标啦`}
                  </p>
                </div>
              </div>
            </div>

            {/* 两个超大行动按钮 */}
            <div className="px-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  startNewSession();
                  setCurrentView('review');
                }}
                disabled={!hasNewLearns}
                className="relative group overflow-hidden rounded-clay-xl p-4 text-white text-left disabled:opacity-50 disabled:cursor-not-allowed btn-press shadow-glow-secondary"
                style={{
                  background: 'linear-gradient(135deg, #4ECDC4 0%, #6BCBE7 100%)',
                }}
              >
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all" />
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center mb-2">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-lg leading-none mb-0.5">新学</p>
                  <p className="text-xs opacity-95 font-medium">
                    {hasNewLearns ? `${newLearnCount} 个待学` : '都学过啦 🎓'}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  startReviewSession();
                  setCurrentView('review');
                }}
                disabled={!hasReviews}
                className="relative group overflow-hidden rounded-clay-xl p-4 text-white text-left disabled:opacity-50 disabled:cursor-not-allowed btn-press shadow-glow-primary"
                style={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 100%)',
                }}
              >
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all" />
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-lg leading-none mb-0.5">复习</p>
                  <p className="text-xs opacity-95 font-medium">
                    {hasReviews ? `${dueReviewCount} 个到期` : '暂无 ✓'}
                  </p>
                </div>
              </button>
            </div>

            {/* 学习总览 - 三栏小卡片 */}
            <div className="px-4 grid grid-cols-3 gap-2.5">
              <div className="glass rounded-2xl p-3 text-center">
                <p className="font-display-en text-2xl font-bold text-primary leading-none">
                  {stats.totalChunks}
                </p>
                <p className="text-[11px] text-textSecondary font-bold mt-1">总语块</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                <p className="font-display-en text-2xl font-bold text-secondaryDark leading-none">
                  {stats.learnedChunks}
                </p>
                <p className="text-[11px] text-textSecondary font-bold mt-1">已学过</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                <p className="font-display-en text-2xl font-bold text-ctaDark leading-none">
                  {stats.masteredChunks}
                </p>
                <p className="text-[11px] text-textSecondary font-bold mt-1">已掌握</p>
              </div>
            </div>

            {/* 三个特性介绍 - 横向滚动 */}
            <div className="px-4">
              <p className="text-xs font-bold text-textSecondary mb-2 uppercase tracking-wider">
                为什么选语块法
              </p>
              <div className="flex gap-2.5 overflow-x-auto pb-1 hide-scrollbar -mx-4 px-4">
                <div className="glass rounded-2xl p-3.5 min-w-[140px] flex-shrink-0">
                  <div className="text-2xl mb-1">🧠</div>
                  <p className="text-sm font-bold text-textPrimary leading-tight">语块记忆</p>
                  <p className="text-xs text-textSecondary mt-0.5 leading-snug">
                    告别孤立背单词
                  </p>
                </div>
                <div className="glass rounded-2xl p-3.5 min-w-[140px] flex-shrink-0">
                  <div className="text-2xl mb-1">⏰</div>
                  <p className="text-sm font-bold text-textPrimary leading-tight">智能复习</p>
                  <p className="text-xs text-textSecondary mt-0.5 leading-snug">
                    SM-2 科学算法
                  </p>
                </div>
                <div className="glass rounded-2xl p-3.5 min-w-[140px] flex-shrink-0">
                  <div className="text-2xl mb-1">🌍</div>
                  <p className="text-sm font-bold text-textPrimary leading-tight">真实场景</p>
                  <p className="text-xs text-textSecondary mt-0.5 leading-snug">
                    日常生活直接用
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'review':
        if (!currentReview) {
          return (
            <div className="text-center space-y-5 px-4 animate-pop">
              <div className="text-7xl animate-bounce-soft">{mode === 'review' ? '💪' : '🎉'}</div>
              <div>
                <h2 className="font-brush text-5xl text-gradient-warm mb-1 leading-none">
                  {mode === 'review' ? 'Great Job!' : 'Awesome!'}
                </h2>
                <p className="text-base font-bold text-textPrimary mt-2">
                  {mode === 'review' ? '复习完成！' : '新学完成！'}
                </p>
              </div>
              <div className="glass rounded-clay-xl p-5 max-w-xs mx-auto">
                <p className="text-sm text-textSecondary mb-1">今日累计学习</p>
                <p className="font-brush text-5xl text-gradient-warm leading-none">
                  {todayLearnedCount} <span className="text-2xl text-textSecondary">个</span>
                </p>
              </div>
              <div className="flex gap-3 justify-center max-w-xs mx-auto">
                <button
                  onClick={() => setCurrentView('today')}
                  className="flex-1 px-5 py-3 bg-white text-textPrimary font-bold rounded-2xl shadow-soft border border-gray-100 btn-press"
                >
                  查看今日
                </button>
                <button
                  onClick={() => setCurrentView('home')}
                  className="flex-1 px-5 py-3 text-white font-bold rounded-2xl shadow-glow-primary btn-press"
                  style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 100%)' }}
                >
                  返回首页
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="w-full max-w-2xl mx-auto space-y-4 animate-fade-in-up">
            <div className="text-center px-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 glass rounded-full mb-2">
                <span className="text-xs font-bold text-textPrimary">
                  {mode === 'review' ? '📖 复习模式' : '✨ 新学模式'}
                </span>
                <span className="text-xs text-textSecondary">·</span>
                <span className="text-xs font-bold text-primary">
                  今日已学 {todayLearnedCount}/{dailyGoal}
                </span>
              </div>
              {mode === 'review' && currentReview.record.reviewCount > 0 && (
                <p className="text-[11px] font-medium text-orange-600 mb-2">
                  上次学习 {Math.floor((Date.now() - new Date(currentReview.record.lastReviewDate).getTime()) / (1000 * 60 * 60 * 24))} 天前 · 已复习 {currentReview.record.reviewCount} 次
                </p>
              )}
              <div className="h-1.5 bg-white/60 rounded-full max-w-md mx-auto overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-warm rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <ChunkCard chunk={currentReview.chunk} />

            <div className="max-w-2xl mx-auto px-4">
              <p className="text-center text-sm font-bold text-textPrimary mb-3">
                这个语块你记得怎么样？
              </p>
              <ReviewButtons onFeedback={submitReview} />
            </div>
          </div>
        );

      case 'today':
        return <TodayReview todayChunks={getTodayLearned()} />;

      case 'stats':
        return <StatsCard stats={stats} />;

      case 'dashboard':
        return <Dashboard />;
    }
  };

  const navItems = [
    { id: 'home' as View, label: '首页', icon: Home, color: '#FF6B6B' },
    { id: 'review' as View, label: '学习', icon: BookOpen, color: '#4ECDC4' },
    { id: 'today' as View, label: '今日', icon: Eye, color: '#FFD93D' },
    { id: 'dashboard' as View, label: '看板', icon: TrendingUp, color: '#A78BFA' },
    { id: 'stats' as View, label: '统计', icon: BarChart3, color: '#FF8E72' },
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className={`min-h-full px-2 sm:px-4 ${
          currentView === 'today' || currentView === 'stats' || currentView === 'dashboard'
            ? 'py-4'
            : currentView === 'home'
            ? ''
            : 'flex items-center justify-center py-4'
        }`}>
          {renderContent()}
        </div>
      </main>

      {/* 底部导航栏 - 玻璃拟态 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-2 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="glass rounded-clay-xl shadow-clay-lg">
            <div className="flex items-center justify-around px-2 py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-2xl btn-press transition-all duration-200 min-w-[56px] relative"
                  >
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-2xl opacity-15"
                        style={{ background: item.color }}
                      />
                    )}
                    <div className="relative flex flex-col items-center gap-0.5">
                      <Icon
                        className={`w-5 h-5 transition-all ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`}
                        style={{ color: isActive ? item.color : '#5C6B7E' }}
                      />
                      <span
                        className={`text-[10px] transition-all ${isActive ? 'font-bold' : 'font-medium'}`}
                        style={{ color: isActive ? item.color : '#5C6B7E' }}
                      >
                        {item.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;
