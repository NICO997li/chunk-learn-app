import { useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { Chunk } from '@/types';
import { ReadAloud } from './ReadAloud';

interface ChunkCardProps {
  chunk: Chunk;
  onFlip?: () => void;
}

// 难度对应的颜色
const difficultyStyle: Record<string, { bg: string; text: string; emoji: string }> = {
  '入门': { bg: 'bg-secondary/15', text: 'text-secondaryDark', emoji: '🌱' },
  '中级': { bg: 'bg-accent/30', text: 'text-orange-600', emoji: '⚡' },
  '高级': { bg: 'bg-cta/15', text: 'text-ctaDark', emoji: '🔥' },
};

export function ChunkCard({ chunk, onFlip }: ChunkCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const diffStyle = difficultyStyle[chunk.difficulty] || difficultyStyle['入门'];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto perspective-1000 px-4">
      <div
        className={`relative w-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* 正面 - 显示英文语块 */}
        <div
          className="relative w-full min-h-[300px] sm:min-h-[340px] glass rounded-clay-xl p-5 sm:p-7 shadow-clay-lg backface-hidden overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* 装饰光晕 */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />

          <div className="relative flex justify-between items-start mb-4 sm:mb-6">
            <span className={`px-3 py-1.5 ${diffStyle.bg} ${diffStyle.text} rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-1`}>
              <span>{diffStyle.emoji}</span>
              {chunk.difficulty}
            </span>
            <div onClick={(e) => e.stopPropagation()}>
              <ReadAloud text={chunk.chunk} />
            </div>
          </div>

          <div className="relative space-y-5 sm:space-y-7 cursor-pointer" onClick={handleFlip}>
            <div className="text-center pt-2">
              <h2 className="font-display-en text-3xl sm:text-4xl md:text-5xl font-bold text-textPrimary mb-3 leading-tight">
                {chunk.chunk}
              </h2>
              <p className="text-sm sm:text-base text-textSecondary font-medium">
                👆 点击卡片揭晓翻译
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
              <div className="w-12 h-1 bg-gradient-warm rounded-full" />
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse-soft" />
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-clay p-4 sm:p-5 border border-white/80">
              <p className="text-sm sm:text-base text-textPrimary/80 italic font-medium leading-relaxed">
                &ldquo;{chunk.example}&rdquo;
              </p>
            </div>
          </div>

          <div className="relative mt-5 sm:mt-7 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-textSecondary font-medium">
              <RotateCcw className="w-3.5 h-3.5 animate-pulse-soft" />
              <span>点击翻转看答案</span>
            </div>
          </div>
        </div>

        {/* 背面 - 显示翻译 */}
        <div
          className="absolute top-0 left-0 w-full min-h-[300px] sm:min-h-[340px] rounded-clay-xl p-5 sm:p-7 shadow-clay-lg backface-hidden cursor-pointer overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 50%, #A78BFA 100%)',
          }}
          onClick={handleFlip}
        >
          {/* 装饰光斑 */}
          <div className="absolute top-4 right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-accent/30 rounded-full blur-3xl" />

          <div className="relative h-full flex flex-col justify-center space-y-4 sm:space-y-5 text-white">
            <div className="text-center">
              <div className="inline-flex items-center gap-1 mb-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">语块翻译</span>
              </div>
              <h2 className="font-display-en text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
                {chunk.chunk}
              </h2>
              <p className="text-xl sm:text-2xl font-bold opacity-95">
                {chunk.translation}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-1 bg-white/60 rounded-full" />
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
              <div className="w-12 h-1 bg-white/60 rounded-full" />
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-clay p-4 sm:p-5 border border-white/30">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm sm:text-base font-medium flex-1 leading-relaxed">
                  &ldquo;{chunk.example}&rdquo;
                </p>
                <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                  <ReadAloud text={chunk.example} />
                </div>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                {chunk.exampleCN}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-white/25 backdrop-blur-sm rounded-full text-xs font-bold">
                📍 {chunk.scenario}
              </span>
              {chunk.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
