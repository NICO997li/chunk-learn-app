interface BrushLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// 7 个字母 M-e-i-h-o-o-S 用不同颜色 + 轻微旋转，像手绘涂鸦
const LETTERS = [
  { char: 'M', color: '#FF6B6B', rotate: -4 },
  { char: 'e', color: '#FF8E72', rotate: 3 },
  { char: 'i', color: '#FFD93D', rotate: -2 },
  { char: 'h', color: '#4ECDC4', rotate: 4 },
  { char: 'o', color: '#6BCBE7', rotate: -3 },
  { char: 'o', color: '#A78BFA', rotate: 2 },
  { char: 'S', color: '#FF6B6B', rotate: -3 },
  { char: 't', color: '#FF8E72', rotate: 4 },
  { char: 'u', color: '#4ECDC4', rotate: -2 },
  { char: 'd', color: '#A78BFA', rotate: 3 },
  { char: 'y', color: '#FFD93D', rotate: -4 },
];

const sizeMap = {
  sm: 'text-3xl',
  md: 'text-4xl',
  lg: 'text-5xl sm:text-6xl',
  xl: 'text-6xl sm:text-7xl',
};

export function BrushLogo({ size = 'lg', className = '' }: BrushLogoProps) {
  return (
    <div className={`font-brush ${sizeMap[size]} font-normal leading-none inline-flex items-end justify-center flex-wrap ${className}`}>
      {LETTERS.map((l, i) => (
        <span
          key={i}
          className="inline-block transition-transform hover:scale-125 hover:-translate-y-1 cursor-default"
          style={{
            color: l.color,
            transform: `rotate(${l.rotate}deg)`,
            textShadow: `2px 3px 0 rgba(0,0,0,0.08)`,
            display: 'inline-block',
            marginRight: i === 5 ? '0.15em' : '0.01em', // Meihoo 和 Study 之间留空隙
            animationDelay: `${i * 0.08}s`,
          }}
        >
          {l.char}
        </span>
      ))}
    </div>
  );
}
