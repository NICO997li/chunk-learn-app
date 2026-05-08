interface BrushLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// 11 个字母用不同颜色 + 轻微旋转，模拟手绘
const LETTERS = [
  { char: 'M', color: '#FF6B6B', rotate: -4 },
  { char: 'e', color: '#FF8E72', rotate: 3 },
  { char: 'i', color: '#FFC93D', rotate: -2 },
  { char: 'h', color: '#4ECDC4', rotate: 4 },
  { char: 'o', color: '#6BCBE7', rotate: -3 },
  { char: 'o', color: '#A78BFA', rotate: 2 },
  { char: 'S', color: '#FF6B6B', rotate: -3 },
  { char: 't', color: '#FF8E72', rotate: 4 },
  { char: 'u', color: '#4ECDC4', rotate: -2 },
  { char: 'd', color: '#A78BFA', rotate: 3 },
  { char: 'y', color: '#FFC93D', rotate: -4 },
];

// Caveat 笔画偏细，需要更大字号才有视觉冲击
const sizeMap = {
  sm: 'text-5xl',
  md: 'text-6xl',
  lg: 'text-7xl sm:text-8xl',
  xl: 'text-8xl sm:text-9xl',
};

export function BrushLogo({ size = 'lg', className = '' }: BrushLogoProps) {
  return (
    <div className={`font-brush ${sizeMap[size]} leading-none inline-flex items-end justify-center flex-wrap ${className}`}>
      {LETTERS.map((l, i) => (
        <span
          key={i}
          className="inline-block transition-transform hover:scale-125 hover:-translate-y-1 cursor-default"
          style={{
            color: l.color,
            transform: `rotate(${l.rotate}deg)`,
            // 多层文字阴影模拟蜡笔/手绘的厚涂效果
            textShadow: `
              1px 1px 0 rgba(255,255,255,0.9),
              2px 3px 0 rgba(0,0,0,0.10),
              0 0 1px ${l.color}
            `,
            display: 'inline-block',
            marginRight: i === 5 ? '0.2em' : '-0.02em',
            WebkitTextStroke: '0.5px rgba(0,0,0,0.05)',
          }}
        >
          {l.char}
        </span>
      ))}
    </div>
  );
}
