import { ReviewFeedback } from '@/types';

interface ReviewButtonsProps {
  onFeedback: (feedback: ReviewFeedback) => void;
  disabled?: boolean;
}

const feedbackOptions = [
  {
    feedback: 'again' as ReviewFeedback,
    label: '完全忘了',
    emoji: '😵',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
    glow: 'shadow-[0_8px_24px_rgba(239,68,68,0.35)]',
    time: '1天后',
  },
  {
    feedback: 'hard' as ReviewFeedback,
    label: '有点难',
    emoji: '🤔',
    gradient: 'linear-gradient(135deg, #FF8E72 0%, #FFA07A 100%)',
    glow: 'shadow-[0_8px_24px_rgba(255,142,114,0.35)]',
    time: '3天后',
  },
  {
    feedback: 'good' as ReviewFeedback,
    label: '记得',
    emoji: '😊',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #6BCBE7 100%)',
    glow: 'shadow-[0_8px_24px_rgba(78,205,196,0.35)]',
    time: '7天后',
  },
  {
    feedback: 'easy' as ReviewFeedback,
    label: '太简单',
    emoji: '🚀',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #C8B6FF 100%)',
    glow: 'shadow-[0_8px_24px_rgba(167,139,250,0.35)]',
    time: '14天后',
  },
];

export function ReviewButtons({ onFeedback, disabled }: ReviewButtonsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
      {feedbackOptions.map((option) => (
        <button
          key={option.feedback}
          onClick={() => onFeedback(option.feedback)}
          disabled={disabled}
          className={`
            relative overflow-hidden
            text-white font-bold
            px-3 py-3 sm:py-3.5 rounded-clay-lg
            ${option.glow}
            btn-press
            disabled:opacity-50 disabled:cursor-not-allowed
            flex flex-col items-center gap-0.5
          `}
          style={{ background: option.gradient }}
        >
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-white/20 rounded-full blur-xl" />
          <div className="relative flex flex-col items-center gap-0.5">
            <span className="text-2xl sm:text-3xl leading-none mb-0.5">{option.emoji}</span>
            <span className="text-sm sm:text-base font-bold">{option.label}</span>
            <span className="text-[10px] sm:text-xs opacity-90 font-medium">
              {option.time}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
