import { useState } from 'react';
import { Settings, Check } from 'lucide-react';

interface DailyGoalSettingProps {
  currentGoal: number;
  onSave: (goal: number) => void;
}

export function DailyGoalSetting({ currentGoal, onSave }: DailyGoalSettingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [goal, setGoal] = useState(currentGoal);

  const presetGoals = [5, 10, 15, 20, 30, 50];

  const handleSave = () => {
    onSave(goal);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 glass rounded-2xl btn-press"
      >
        <Settings className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-textPrimary">
          {currentGoal}/天
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <div className="bg-white rounded-clay-xl shadow-clay-lg max-w-md w-full p-6">
            <h2 className="font-brush text-4xl text-gradient-warm mb-1 leading-none">
              Daily Goal
            </h2>
            <p className="text-sm font-bold text-textPrimary mb-1">每日学习目标</p>
            <p className="text-xs text-textSecondary mb-5">
              坚持每天学一点，效果远超偶尔猛学
            </p>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {presetGoals.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setGoal(preset)}
                  className={`
                    py-3 rounded-clay font-bold text-lg btn-press transition-all
                    ${goal === preset
                      ? 'text-white shadow-glow-primary'
                      : 'bg-gray-50 text-textPrimary hover:bg-gray-100'
                    }
                  `}
                  style={goal === preset ? {
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 100%)',
                  } : {}}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-wider">
                自定义数量
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-clay bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none font-bold text-lg"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-gray-100 text-textPrimary font-bold rounded-2xl btn-press"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 text-white font-bold rounded-2xl btn-press shadow-glow-primary flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 100%)' }}
              >
                <Check className="w-5 h-5" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
