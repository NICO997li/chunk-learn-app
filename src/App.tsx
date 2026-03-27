import { useState } from 'react';
import { Home, BookOpen, BarChart3, Info, Eye } from 'lucide-react';
import { useLearning } from '@/hooks/useLearning';
import { ChunkCard } from '@/components/ChunkCard';
import { ReviewButtons } from '@/components/ReviewButtons';
import { StatsCard } from '@/components/StatsCard';
import { DailyGoalSetting } from '@/components/DailyGoalSetting';
import { TodayReview } from '@/components/TodayReview';

type View = 'home' | 'review' | 'today' | 'stats' | 'about';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const {
    stats,
    currentReview,
    submitReview,
    startNewSession,
    hasReviews,
    getTodayLearned,
    dailyGoal,
    saveDailyGoal,
    todayLearnedCount,
  } = useLearning();

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* 每日目标设置 */}
            <div className="flex justify-center">
              <DailyGoalSetting currentGoal={dailyGoal} onSave={saveDailyGoal} />
            </div>

            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-4">
                meihoo语块学习
              </h1>
              <p className="text-xl font-body text-textPrimary/70 mb-2">
                语块学习法 · 高效记忆英语
              </p>
              <p className="text-base font-body text-textPrimary/60">
                不再孤立背单词，掌握固定搭配，事半功倍
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-clay-lg p-6 shadow-clay text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-clay mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-textPrimary mb-2">
                  语块记忆
                </h3>
                <p className="text-sm font-body text-textPrimary/60">
                  4-8个单词的固定搭配，在语境中学习单词用法
                </p>
              </div>

              <div className="bg-white rounded-clay-lg p-6 shadow-clay text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-clay mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-textPrimary mb-2">
                  智能复习
                </h3>
                <p className="text-sm font-body text-textPrimary/60">
                  基于SM-2算法，科学安排复习时间，长期记忆
                </p>
              </div>

              <div className="bg-white rounded-clay-lg p-6 shadow-clay text-center">
                <div className="w-16 h-16 bg-cta/10 rounded-clay mx-auto mb-4 flex items-center justify-center">
                  <Home className="w-8 h-8 text-cta" />
                </div>
                <h3 className="text-lg font-heading font-bold text-textPrimary mb-2">
                  真实场景
                </h3>
                <p className="text-sm font-body text-textPrimary/60">
                  涵盖日常、工作、社交等场景，即学即用
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  startNewSession();
                  setCurrentView('review');
                }}
                disabled={!hasReviews}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-heading font-bold text-lg rounded-clay-lg shadow-clay-lg hover:shadow-clay-pressed transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hasReviews ? '开始学习' : '暂无待复习词块'}
              </button>
              {hasReviews && (
                <p className="mt-3 text-sm font-body text-textPrimary/60">
                  今天有 {stats.todayReviews} 个语块待复习 · 目标 {dailyGoal} 个
                </p>
              )}
              {todayLearnedCount > 0 && (
                <p className="mt-2 text-sm font-body text-primary/80 font-bold">
                  今日已学习 {todayLearnedCount} / {dailyGoal} 个 🎉
                </p>
              )}
            </div>
          </div>
        );

      case 'review':
        if (!currentReview) {
          return (
            <div className="text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <h2 className="text-3xl font-heading font-bold text-primary">
                太棒了！
              </h2>
              <p className="text-lg font-body text-textPrimary/70">
                今天的学习目标已完成
              </p>
              <p className="text-base font-body text-textPrimary/60">
                已学习 {todayLearnedCount} 个语块
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => setCurrentView('today')}
                  className="px-6 py-3 bg-primary text-white font-body font-bold rounded-clay shadow-clay hover:shadow-clay-pressed transition-all duration-200 cursor-pointer"
                >
                  查看今日回看
                </button>
                <button
                  onClick={() => setCurrentView('home')}
                  className="px-6 py-3 bg-cta text-white font-body font-bold rounded-clay shadow-clay hover:shadow-clay-pressed transition-all duration-200 cursor-pointer"
                >
                  返回首页
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-sm font-body text-textPrimary/60 mb-2">
                学习进度: {todayLearnedCount} / {dailyGoal}
              </p>
              <div className="h-2 bg-background rounded-full max-w-md mx-auto overflow-hidden">
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

      case 'about':
        return (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-clay-lg p-8 shadow-clay-lg">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">
                关于语块学习法
              </h2>
              
              <div className="space-y-4 font-body text-textPrimary/80">
                <p className="text-lg leading-relaxed">
                  <strong className="text-primary">语块</strong>，就是最小单位的语境。语块是经常一起使用的单词组合,本应用采用的是 4-8 个单词的实用语块。
                </p>

                <p className="leading-relaxed">
                  传统的背单词方法往往让我们陷入&ldquo;一词多义&rdquo;的困境，记住了单词却不会用。而语块学习法通过记忆单词在真实语境中的用法，让你：
                </p>

                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>同时掌握单词的发音、拼写和用法</li>
                  <li>提高听力理解速度和口语流利度</li>
                  <li>建立地道的英语表达习惯</li>
                  <li>减少&ldquo;中式英语&rdquo;的错误</li>
                </ul>

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-clay p-6 mt-6">
                  <h3 className="text-xl font-heading font-bold text-primary mb-3">
                    智能复习系统
                  </h3>
                  <p className="leading-relaxed">
                    本应用采用 <strong>SM-2 间隔重复算法</strong>，根据你的掌握程度智能安排复习时间。记得越牢的语块，复习间隔越长；遗忘的语块会更频繁地出现，确保长期记忆。
                  </p>
                </div>

                <div className="bg-cta/10 rounded-clay p-6 mt-6">
                  <h3 className="text-xl font-heading font-bold text-cta mb-3">
                    学习建议
                  </h3>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>每天坚持复习 10-15 分钟</li>
                    <li>遇到语块要在脑中造句</li>
                    <li>尽量大声朗读，训练口语</li>
                    <li>诚实评估自己的掌握程度</li>
                  </ul>
                </div>

                <div className="bg-secondary/10 rounded-clay p-6 mt-6">
                  <h3 className="text-xl font-heading font-bold text-secondary mb-3">
                    应用数据
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-heading font-bold text-primary">250</p>
                      <p className="text-sm text-textPrimary/60">精选语块</p>
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-bold text-primary">6</p>
                      <p className="text-sm text-textPrimary/60">大场景</p>
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-bold text-primary">4</p>
                      <p className="text-sm text-textPrimary/60">难度等级</p>
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-bold text-primary">SM-2</p>
                      <p className="text-sm text-textPrimary/60">复习算法</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const navItems = [
    { id: 'home' as View, label: '首页', icon: Home },
    { id: 'review' as View, label: '学习', icon: BookOpen },
    { id: 'today' as View, label: '今日', icon: Eye },
    { id: 'stats' as View, label: '统计', icon: BarChart3 },
    { id: 'about' as View, label: '关于', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-clay sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-clay flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-primary">
                MeihooStudy
              </span>
            </div>

            <div className="flex gap-1 md:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`
                      px-3 md:px-4 py-2 rounded-clay font-body font-medium transition-all duration-200 cursor-pointer
                      ${
                        isActive
                          ? 'bg-primary text-white shadow-clay'
                          : 'bg-background text-textPrimary/70 hover:bg-background/80'
                      }
                    `}
                  >
                    <span className="hidden md:inline">{item.label}</span>
                    <Icon className="w-5 h-5 md:hidden" />
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center">
        <p className="text-sm font-body text-textPrimary/50">
          © 2026 meihoo语块学习 · MeihooStudy · 让英语学习事半功倍
        </p>
      </footer>
    </div>
  );
}

export default App;
