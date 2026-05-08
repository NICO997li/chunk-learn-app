interface BrushLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  // 'multicolor' = 每个字母彩色（适合粗体手写）
  // 'gradient' = 整体渐变（适合连笔花体，更自然）
  variant?: 'multicolor' | 'gradient';
}

const sizeMap = {
  sm: 'text-4xl',
  md: 'text-5xl',
  lg: 'text-6xl sm:text-7xl',
  xl: 'text-7xl sm:text-8xl',
};

export function BrushLogo({ size = 'lg', className = '', variant = 'gradient' }: BrushLogoProps) {
  if (variant === 'gradient') {
    // 整体渐变上色 - 适合连笔手写体（Homemade Apple）
    return (
      <div className={`relative inline-block ${className}`}>
        {/* 装饰下划波浪线 */}
        <svg
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 pointer-events-none"
          width="80%"
          height="14"
          viewBox="0 0 200 14"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M2 8 Q 25 2, 50 7 T 100 8 T 150 7 T 198 8"
            stroke="url(#brushGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <defs>
            <linearGradient id="brushGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="50%" stopColor="#4ECDC4" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
        </svg>
        <h1
          className={`font-brush ${sizeMap[size]} leading-tight inline-block`}
          style={{
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 20%, #FFC93D 40%, #4ECDC4 65%, #6BCBE7 80%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,0.06))',
            transform: 'rotate(-2deg)',
            paddingBottom: '0.1em',
          }}
        >
          Meihoo Study
        </h1>
      </div>
    );
  }

  // multicolor 模式（旧的字母彩色版，保留备用）
  const letters = [
    { char: 'M', color: '#FF6B6B', rotate: -3 },
    { char: 'e', color: '#FF8E72', rotate: 2 },
    { char: 'i', color: '#FFC93D', rotate: -2 },
    { char: 'h', color: '#4ECDC4', rotate: 3 },
    { char: 'o', color: '#6BCBE7', rotate: -2 },
    { char: 'o', color: '#A78BFA', rotate: 2 },
    { char: 'S', color: '#FF6B6B', rotate: -3 },
    { char: 't', color: '#FF8E72', rotate: 3 },
    { char: 'u', color: '#4ECDC4', rotate: -2 },
    { char: 'd', color: '#A78BFA', rotate: 2 },
    { char: 'y', color: '#FFC93D', rotate: -3 },
  ];

  return (
    <div className={`font-brush ${sizeMap[size]} leading-none inline-flex items-end justify-center flex-wrap ${className}`}>
      {letters.map((l, i) => (
        <span
          key={i}
          className="inline-block transition-transform hover:scale-125"
          style={{
            color: l.color,
            transform: `rotate(${l.rotate}deg)`,
            textShadow: `1px 1px 0 rgba(255,255,255,0.9), 2px 3px 0 rgba(0,0,0,0.10)`,
            display: 'inline-block',
            marginRight: i === 5 ? '0.2em' : '-0.02em',
          }}
        >
          {l.char}
        </span>
      ))}
    </div>
  );
}
