import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, CheckCircle } from 'lucide-react';

interface ReadAloudProps {
  text: string;
  lang?: string;
}

export function ReadAloud({ text, lang = 'en-US' }: ReadAloudProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // 初始化语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = lang;
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('识别结果:', transcript);
        setHasRead(true);
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('语音识别错误:', event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [lang]);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      // 停止之前的播放
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9; // 稍微慢一点，便于跟读

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleRecord = () => {
    if (!recognition) {
      alert('你的浏览器不支持语音识别功能');
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      setHasRead(false);
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* 播放按钮 */}
      <button
        onClick={isSpeaking ? handleStopSpeak : handleSpeak}
        className={`
          p-3 rounded-clay font-body font-bold transition-all duration-200 cursor-pointer
          ${
            isSpeaking
              ? 'bg-secondary text-white shadow-clay animate-pulse'
              : 'bg-primary text-white shadow-clay hover:shadow-clay-pressed'
          }
        `}
        title={isSpeaking ? '停止播放' : '播放语音'}
      >
        {isSpeaking ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      {/* 跟读按钮 */}
      {recognition && (
        <button
          onClick={handleRecord}
          className={`
            p-3 rounded-clay font-body font-bold transition-all duration-200 cursor-pointer flex items-center gap-2
            ${
              isRecording
                ? 'bg-red-500 text-white shadow-clay animate-pulse'
                : hasRead
                ? 'bg-green-500 text-white shadow-clay'
                : 'bg-cta text-white shadow-clay hover:shadow-clay-pressed'
            }
          `}
          title={isRecording ? '停止录音' : '点击跟读'}
        >
          {hasRead ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
          <span className="text-sm hidden sm:inline">
            {isRecording ? '录音中...' : hasRead ? '已跟读' : '跟读'}
          </span>
        </button>
      )}

      {!recognition && (
        <span className="text-xs font-body text-textPrimary/50">
          浏览器不支持语音识别
        </span>
      )}
    </div>
  );
}
