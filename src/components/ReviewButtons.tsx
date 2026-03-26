import { XCircle, Frown, Smile, Zap } from 'lucide-react';
import { ReviewFeedback } from '@/types';

interface ReviewButtonsProps {
  onFeedback: (feedback: ReviewFeedback) => void;
  disabled?: boolean;
}

const feedbackOptions = [
  {
    feedback: 'again' as ReviewFeedback,
    label: '完全忘记',
    color: 'bg-red-500 hover:bg-red-600',
    icon: XCircle,
    time: '1天后',
  },
  {
    feedback: 'hard' as ReviewFeedback,
    label: '有点难',
    color: 'bg-orange-500 hover:bg-orange-600',
    icon: Frown,
    time: '3天后',
  },
  {
    feedback: 'good' as ReviewFeedback,
    label: '记得',
    color: 'bg-cta hover:bg-green-600',
    icon: Smile,
    time: '7天后',
  },
  {
    feedback: 'easy' as ReviewFeedback,
    label: '轻松',
    color: 'bg-blue-500 hover:bg-blue-600',
    icon: Zap,
    time: '14天后',
  },
];

export function ReviewButtons({ onFeedback, disabled }: ReviewButtonsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {feedbackOptions.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.feedback}
            onClick={() => onFeedback(option.feedback)}
            disabled={disabled}
            className={`
              ${option.color}
              text-white font-body font-bold
              px-6 py-4 rounded-clay shadow-clay
              transition-all duration-200
              hover:shadow-clay-pressed active:shadow-clay-pressed
              disabled:opacity-50 disabled:cursor-not-allowed
              cursor-pointer
              flex flex-col items-center gap-2
            `}
          >
            <Icon className="w-6 h-6" />
            <span className="text-base">{option.label}</span>
            <span className="text-xs opacity-80">{option.time}</span>
          </button>
        );
      })}
    </div>
  );
}
