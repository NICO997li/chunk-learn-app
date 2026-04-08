import { useState, useEffect } from 'react';
import { Home, BookOpen, BarChart3, Eye, TrendingUp, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { useLearning } from '@/hooks/useLearning';
import { ChunkCard } from '@/components/ChunkCard';
import { ReviewButtons } from '@/components/ReviewButtons';
import { StatsCard } from '@/components/StatsCard';
import { DailyGoalSetting } from '@/components/DailyGoalSetting';
import { TodayReview } from '@/components/TodayReview';
import { UserSelect } from '@/components/UserSelect';
import { Dashboard } from '@/components/Dashboard';
import { UserProfile } from '@/types';
import { getCurrentUser, logoutUser, deleteUser } from '@/utils/storage';
import { deleteUserFromCloud } from '@/utils/firebase';

type View = 'home' | 'review' | 'today' | 'stats' | 'dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查是否已登录
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

  // 加载中
  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-4xl animate-pulse">📚</div>
      </div>
    );
  }

  // 未登录 → 显示用户选择页
  if (!currentUser) {
    return <UserSelect onUserSelected={handleUserSelected} />;
  }

  // 已登录 → 显示主应用
  return <MainApp currentUser={currentUser} onLogout={handleLogout} />;
}

// 主应用组件
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

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="w-full max-w-4xl mx-auto space-y-4 py-4">
            {/* 用户信息栏 */}
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentUser.avatar}</span>
                <span className="font-heading font-bold text-textPrimary">
                  {currentUser.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DailyGoalSetting currentGoal={dailyGoal} onSave={saveDailyGoal} />
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 bg-white rounded-clay shadow-clay hover:shadow-clay-pressed transition-all duration-200 cursor-pointer"
                  title="删除账号"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 bg-white rounded-clay shadow-clay hover:shadow-clay-pressed transition-all duration-200 cursor-pointer"
                  title="切换用户"
                >
                  <LogOut className="w-4 h-4 text-textPrimary/60" />
                </button>
              </div>
            </div>

            {/* 删除账号确认弹窗 */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-clay-lg shadow-clay-lg max-w-sm w-full p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-textPrimary">删除账号</h3>
                      <p className="text-sm font-body text-textPrimary/60">
                        确定删除 <strong>{currentUser.name}</strong> 的所有数据？
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-body text-red-500 mb-4">
                    此操作不可恢复，本地和云端数据都将被删除！
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2.5 bg-background text-textPrimary font-body font-bold rounded-clay hover:bg-background/80 transition-all cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 py-2.5 bg-red-500 text-white font-body font-bold rounded-clay shadow-clay hover:bg-red-600 transition-all cursor-pointer"
                    >
                      确认删除
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center px-4">
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-2">
                meihoo语块学习
              </h1>
              <p className="text-base sm:text-lg font-body text-textPrimary/70 mb-1">
                语块学习法 · 高效记忆英语
              </p>
              <p className="text-xs sm:text-sm font-body text-textPrimary/60">
                不再孤立背单词，掌握固定搭配，事半功倍
              </p>
            </div>

            {/* 3个特性卡片 - 横向滚动 */}
            <div className="flex gap-3 overflow-x-auto px-4 pb-2 hide-scrollbar">
              <div className="bg-white rounded-clay p-4 shadow-clay text-center min-w-[140px] flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-clay mx-auto mb-2 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-heading font-bold text-textPrimary mb-1">
                  语块记忆
                </h3>
                <p className="text-xs font-body text-textPrimary/60">
                  固定搭配学习
                </p>
              </div>

              <div className="bg-white rounded-clay p-4 shadow-clay text-center min-w-[140px] flex-shrink-0">
                <div className="w-12 h-12 bg-secondary/10 rounded-clay mx-auto mb-2 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-sm font-heading font-bold text-textPrimary mb-1">
                  智能复习
                </h3>
                <p className="text-xs font-body text-textPrimary/60">
                  SM-2科学算法
                </p>
              </div>

              <div className="bg-white rounded-clay p-4 shadow-clay text-center min-w-[140px] flex-shrink-0">
                <div className="w-12 h-12 bg-cta/10 rounded-clay mx-auto mb-2 flex items-center justify-center">
                  <Home className="w-6 h-6 text-cta" />
                </div>
                <h3 className="text-sm font-heading font-bold text-textPrimary mb-1">
                  真实场景
                </h3>
                <p className="text-xs font-body text-textPrimary/60">
                  日常工作社交
                </p>
              </div>
            </div>

            <div className="text-center px-4 space-y-3">
              {/* 两个按钮：新学 + 复习 */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    startNewSession();
                    setCurrentView('review');
                  }}
                  disabled={!hasNewLearns}
                  className="flex-1 max-w-[180px] px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-heading font-bold text-base rounded-clay-lg shadow-clay-lg hover:shadow-clay-pressed transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="block">新学</span>
                  <span className="block text-xs font-body opacity-80 mt-0.5">
                    {hasNewLearns ? `${newLearnCount} 个可学` : '暂无新语块'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    startReviewSession();
                    setCurrentView('review');
                  }}
                  disabled={!hasReviews}
                  className="flex-1 max-w-[180px] px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-heading font-bold text-base rounded-clay-lg shadow-clay-lg hover:shadow-clay-pressed transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="block">复习</span>
                  <span className="block text-xs font-body opacity-80 mt-0.5">
                    {hasReviews ? `${dueReviewCount} 个到期` : '暂无待复习'}
                  </span>
                </button>
              </div>

              {/* 进度信息 */}
              <p className="text-sm font-body text-textPrimary/60">
                已学 {stats.learnedChunks}/{stats.totalChunks} · 目标 {dailyGoal}/天
              </p>
              {todayLearnedCount > 0 && (
                <p className="text-sm font-body text-primary/80 font-bold">
                  今日已学习 {todayLearnedCount} 个 🎉
                </p>
              )}
            </div>
          </div>
        );

      case 'review':
        if (!currentReview) {
          return (
            <div className="text-center space-y-4 px-4">
              <div className="text-5xl">{mode === 'review' ? '💪' : '🎉'}</div>
              <h2 className="text-2xl font-heading font-bold text-primary">
                {mode === 'review' ? '复习完成！' : '新学完成！'}
              </h2>
              <p className="text-base font-body text-textPrimary/70">
                {mode === 'review' ? '本轮复习已完成' : '本轮新学已完成'}
              </p>
              <p className="text-sm font-body text-textPrimary/60">
                今日累计学习 {todayLearnedCount} 个语块
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => setCurrentView('today')}
                  className="flex-1 min-w-[130px] max-w-[160px] px-5 py-2.5 bg-primary text-white font-body font-bold rounded-clay shadow-clay hover:shadow-clay-pressed transition-all duration-200 cursor-pointer"
                >
                  查看今日回看
                </button>
                <button
                  onClick={() => setCurrentView('home')}
                  className="flex-1 min-w-[130px] max-w-[160px] px-5 py-2.5 bg-cta text-white font-body font-bold rounded-clay shadow-clay hover:shadow-clay-pressed transition-all duration-200 cursor-pointer"
                >
                  返回首页
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="w-full max-w-2xl mx-auto space-y-4">
            <div className="text-center px-4">
              <p className="text-xs font-body text-textPrimary/60 mb-1">
                {mode === 'review' ? '📖 复习模式' : '✨ 新学模式'} · 今日已学 {todayLearnedCount}
              </p>
              {mode === 'review' && currentReview.record.reviewCount > 0 && (
                <p className="text-[10px] font-body text-orange-500 mb-1">
                  上次学习 {Math.floor((Date.now() - new Date(currentReview.record.lastReviewDate).getTime()) / (1000 * 60 * 60 * 24))} 天前 · 已复习 {currentReview.record.reviewCount} 次
                </p>
              )}
              <div className="h-1.5 bg-background rounded-full max-w-md mx-auto overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((todayLearnedCount / dailyGoal) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <ChunkCard chunk={currentReview.chunk} />

            <div className="max-w-2xl mx-auto">
              <p className="text-center text-sm font-body text-textPrimary/70 mb-4">
                选择记忆程度：
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
    { id: 'home' as View, label: '首页', icon: Home },
    { id: 'review' as View, label: '学习', icon: BookOpen },
    { id: 'today' as View, label: '今日', icon: Eye },
    { id: 'dashboard' as View, label: '看板', icon: TrendingUp },
    { id: 'stats' as View, label: '统计', icon: BarChart3 },
  ];

  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col">
      {/* Header - 只保留 logo，仅在首页显示 */}
      {currentView === 'home' && (
        <header className="bg-white shadow-clay flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-clay flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-heading font-bold text-primary">
                MeihooStudy
              </span>
            </div>
          </div>
        </header>
      )}

      {/* Main Content - 固定高度，内部可滚动 */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="h-full flex items-center justify-center px-4">
          {renderContent()}
        </div>
      </main>

      {/* 底部导航栏 - 固定在底部 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-clay-lg z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around max-w-7xl mx-auto px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-body transition-all duration-200 cursor-pointer min-w-[64px]
                  ${
                    isActive
                      ? 'text-primary'
                      : 'text-textPrimary/60 hover:text-textPrimary'
                  }
                `}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default App;
