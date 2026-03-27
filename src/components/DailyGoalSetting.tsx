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
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-clay shadow-clay hover:shadow-clay-pressed transition-all duration-200 cursor-pointer"
      >
        <Settings className="w-5 h-5 text-primary" />
        <span className="font-body text-sm text-textPrimary">
          每日目标: {currentGoal} 个
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-clay-lg shadow-clay-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">
              设置每日学习目标
            </h2>
            
            <p className="font-body text-textPrimary/70 mb-6">
              选择你每天想要学习的语块数量
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {presetGoals.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setGoal(preset)}
                  className={`
                    py-3 rounded-clay font-body font-bold transition-all duration-200 cursor-pointer
                    ${
                      goal === preset
                        ? 'bg-primary text-white shadow-clay'
                        : 'bg-background text-textPrimary hover:bg-background/80'
                    }
                  `}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block font-body text-sm text-textPrimary/70 mb-2">
                或自定义数量:
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-clay border-2 border-background focus:border-primary outline-none font-body"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-background text-textPrimary font-body font-bold rounded-clay hover:bg-background/80 transition-all duration-200 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-primary text-white font-body font-bold rounded-clay shadow-clay hover:shadow-clay-pressed transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
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
