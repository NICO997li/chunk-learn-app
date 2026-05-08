interface BrushLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// 11 个字母多巴胺色彩循环 + 随机轻微旋转
const LETTERS = [
  { char: 'M', color: '#FF6B6B', rotate: -5 },
  { char: 'e', color: '#FF8E72', rotate: 3 },
  { char: 'i', color: '#FFC93D', rotate: -3 },
  { char: 'h', color: '#4ECDC4', rotate: 5 },
  { char: 'o', color: '#6BCBE7', rotate: -3 },
  { char: 'o', color: '#A78BFA', rotate: 2 },
  { char: 'S', color: '#FF6B6B', rotate: -4 },
  { char: 't', color: '#FF8E72', rotate: 4 },
  { char: 'u', color: '#4ECDC4', rotate: -3 },
  { char: 'd', color: '#A78BFA', rotate: 3 },
  { char: 'y', color: '#FFC93D', rotate: -5 },
];

const sizeMap = {
  sm: 'text-4xl',
  md: 'text-5xl',
  lg: 'text-6xl sm:text-7xl',
  xl: 'text-7xl sm:text-8xl',
};

export function BrushLogo({ size = 'lg', className = '' }: BrushLogoProps) {
  return (
    <div className={`font-brush ${sizeMap[size]} leading-none inline-flex items-end justify-center flex-wrap ${className}`}>
      {LETTERS.map((l, i) => (
        <span
          key={i}
          className="inline-block transition-transform hover:scale-125 hover:-translate-y-2 cursor-default"
          style={{
            color: l.color,
            transform: `rotate(${l.rotate}deg)`,
            // 卡通厚重投影：白色描边 + 黑色立体阴影
            textShadow: `
              -2px -2px 0 rgba(255,255,255,0.8),
              2px -2px 0 rgba(255,255,255,0.8),
              -2px 2px 0 rgba(255,255,255,0.8),
              2px 2px 0 rgba(255,255,255,0.8),
              4px 5px 0 rgba(0,0,0,0.18),
              5px 6px 0 rgba(0,0,0,0.10)
            `,
            display: 'inline-block',
            marginRight: i === 5 ? '0.25em' : '0.02em',
          }}
        >
          {l.char}
        </span>
      ))}
    </div>
  );
}
