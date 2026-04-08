import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Mic, CheckCircle } from 'lucide-react';

interface ReadAloudProps {
  text: string;
  lang?: string;
}

// 优先选择自然度高的英文声音（按优先级排序）
const PREFERRED_VOICES = [
  // iOS/macOS 高质量声音
  'Samantha',  // macOS/iOS 默认女声，很自然
  'Karen',     // 澳洲英语女声
  'Daniel',    // 英式英语男声
  'Moira',     // 爱尔兰英语女声
  // Android / Windows 高质量声音
  'Microsoft Aria',      // Windows 11 自然语音
  'Microsoft Jenny',     // Windows 11 自然语音
  'Microsoft Guy',       // Windows 11 自然男声
  'Google UK English Female',
  'Google UK English Male',
  'Google US English',
  // 通用
  'English United States',
  'English United Kingdom',
];

function getBestVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  // 按优先级查找
  for (const preferred of PREFERRED_VOICES) {
    const found = voices.find(v => 
      v.name.includes(preferred) && v.lang.startsWith('en')
    );
    if (found) return found;
  }

  // 找带 "Natural" 或 "Enhanced" 标记的声音（通常更自然）
  const natural = voices.find(v => 
    v.lang.startsWith('en') && 
    (v.name.toLowerCase().includes('natural') || 
     v.name.toLowerCase().includes('enhanced') ||
     v.name.toLowerCase().includes('premium'))
  );
  if (natural) return natural;

  // 找 en-US 或 en-GB 的声音
  const enVoice = voices.find(v => v.lang === 'en-US') || 
                  voices.find(v => v.lang === 'en-GB') ||
                  voices.find(v => v.lang.startsWith('en'));
  if (enVoice) return enVoice;

  // 兜底
  return voices[0];
}

export function ReadAloud({ text, lang = 'en-US' }: ReadAloudProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRead, setHasRead] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const bestVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // 加载可用声音
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      bestVoiceRef.current = getBestVoice(voices, lang);
    };

    loadVoices();
    // 有些浏览器异步加载声音列表
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [lang]);

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
      utterance.rate = 0.92;   // 略慢，更自然
      utterance.pitch = 1.0;   // 正常音调
      utterance.volume = 1.0;

      // 使用最佳声音
      if (bestVoiceRef.current) {
        utterance.voice = bestVoiceRef.current;
      }

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
