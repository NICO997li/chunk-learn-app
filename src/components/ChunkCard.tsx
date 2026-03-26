import { useState } from 'react';
import { Volume2, RotateCcw } from 'lucide-react';
import { Chunk } from '@/types';
import { difficultyNames } from '@/data/chunks';

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

  const playAudio = () => {
    // 使用Web Speech API朗读语块
    const utterance = new SpeechSynthesisUtterance(chunk.text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto perspective-1000">
      <div
        className={`relative w-full transition-transform duration-500 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* 正面 - 显示语块 */}
        <div
          className="w-full min-h-[400px] bg-white rounded-clay-lg p-8 shadow-clay-lg backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="flex justify-between items-start mb-6">
            <span className="px-4 py-2 bg-secondary/20 text-secondary rounded-clay text-sm font-medium">
              {difficultyNames[chunk.difficulty]}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio();
              }}
              className="p-3 bg-cta/10 hover:bg-cta/20 rounded-clay shadow-clay transition-all duration-200 cursor-pointer"
              aria-label="播放语音"
            >
              <Volume2 className="w-6 h-6 text-cta" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-heading font-bold text-primary mb-4">
                {chunk.text}
              </h2>
              <p className="text-lg text-textPrimary/60 font-body">
                点击卡片查看翻译
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
            </div>

            <div className="bg-background/50 rounded-clay p-6 shadow-clay">
              <p className="text-lg text-textPrimary/80 italic font-body">
                {chunk.example}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-textPrimary/50 font-body">
              <RotateCcw className="w-4 h-4" />
              <span>点击卡片翻转</span>
            </div>
          </div>
        </div>

        {/* 背面 - 显示翻译和详细信息 */}
        <div
          className="absolute top-0 left-0 w-full min-h-[400px] bg-gradient-to-br from-primary to-secondary rounded-clay-lg p-8 shadow-clay-lg backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="h-full flex flex-col justify-center space-y-6 text-white">
            <div className="text-center">
              <h2 className="text-4xl font-heading font-bold mb-2">
                {chunk.text}
              </h2>
              <p className="text-2xl font-body opacity-90">
                {chunk.translation}
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-16 h-1 bg-white/50 rounded-full" />
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-clay p-6">
              <p className="text-lg mb-3 font-body">
                {chunk.example}
              </p>
              <p className="text-base opacity-80 font-body">
                {chunk.exampleTranslation}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-clay">
                <span className="text-sm font-body">目标单词:</span>
                <span className="text-lg font-bold font-heading">
                  {chunk.targetWord}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
