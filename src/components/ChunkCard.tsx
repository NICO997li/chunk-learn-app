import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Chunk } from '@/types';
import { ReadAloud } from './ReadAloud';

interface ChunkCardProps {
  chunk: Chunk;
  onFlip?: () => void;
}

export function ChunkCard({ chunk, onFlip }: ChunkCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto perspective-1000 px-4">
      <div
        className={`relative w-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* 正面 - 显示语块 */}
        <div
          className="w-full min-h-[350px] sm:min-h-[400px] bg-white rounded-clay-lg p-6 sm:p-8 shadow-clay-lg backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary/20 text-secondary rounded-clay text-xs sm:text-sm font-medium">
              {chunk.difficulty}
            </span>
            <div onClick={(e) => e.stopPropagation()}>
              <ReadAloud text={chunk.chunk} />
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8 cursor-pointer" onClick={handleFlip}>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary mb-3 sm:mb-4">
                {chunk.chunk}
              </h2>
              <p className="text-base sm:text-lg text-textPrimary/60 font-body">
                点击卡片查看翻译
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
            </div>

            <div className="bg-background/50 rounded-clay p-4 sm:p-6 shadow-clay">
              <p className="text-base sm:text-lg text-textPrimary/80 italic font-body">
                &ldquo;{chunk.example}&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-textPrimary/50 font-body">
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>点击卡片翻转</span>
            </div>
          </div>
        </div>

        {/* 背面 - 显示翻译和详细信息 */}
        <div
          className="absolute top-0 left-0 w-full min-h-[350px] sm:min-h-[400px] bg-gradient-to-br from-primary to-secondary rounded-clay-lg p-6 sm:p-8 shadow-clay-lg backface-hidden cursor-pointer"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          onClick={handleFlip}
        >
          <div className="h-full flex flex-col justify-center space-y-4 sm:space-y-6 text-white">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-2">
                {chunk.chunk}
              </h2>
              <p className="text-xl sm:text-2xl font-body opacity-90">
                {chunk.translation}
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-16 h-1 bg-white/50 rounded-full" />
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-clay p-4 sm:p-6">
              <p className="text-base sm:text-lg mb-2 sm:mb-3 font-body">
                &ldquo;{chunk.example}&rdquo;
              </p>
              <p className="text-sm sm:text-base opacity-80 font-body">
                {chunk.exampleCN}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-2.5 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-clay text-xs sm:text-sm">
                {chunk.scenario}
              </span>
              {chunk.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-clay text-xs sm:text-sm"
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
