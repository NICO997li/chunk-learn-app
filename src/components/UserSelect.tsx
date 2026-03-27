import { useState } from 'react';
import { UserPlus, LogIn, Sparkles } from 'lucide-react';
import { UserProfile } from '@/types';
import { getAllUsers, addUser, setCurrentUser, generateUserId } from '@/utils/storage';

interface UserSelectProps {
  onUserSelected: (user: UserProfile) => void;
}

const AVATARS = ['😊', '😎', '🌟', '🦄', '🐱', '🐶', '🌸', '🎯', '🚀', '💪', '🎵', '❤️'];

export function UserSelect({ onUserSelected }: UserSelectProps) {
  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('😊');
  const existingUsers = getAllUsers();

  const handleCreateUser = () => {
    if (!name.trim()) return;
    
    const newUser: UserProfile = {
      id: generateUserId(),
      name: name.trim(),
      avatar,
      createdAt: new Date().toISOString(),
    };
    
    addUser(newUser);
    setCurrentUser(newUser);
    onUserSelected(newUser);
  };

  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    onUserSelected(user);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white rounded-clay-lg shadow-clay-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-clay-lg mx-auto mb-3 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary">
            MeihooStudy
          </h1>
          <p className="text-sm font-body text-textPrimary/60 mt-1">
            选择你的身份，开始学习
          </p>
        </div>

        {mode === 'select' && existingUsers.length > 0 ? (
          <>
            {/* 已有用户列表 */}
            <div className="space-y-3 mb-4">
              {existingUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full flex items-center gap-3 p-4 bg-background rounded-clay hover:shadow-clay transition-all duration-200 cursor-pointer"
                >
                  <span className="text-3xl">{user.avatar}</span>
                  <div className="text-left flex-1">
                    <p className="font-heading font-bold text-textPrimary">{user.name}</p>
                    <p className="text-xs font-body text-textPrimary/50">
                      加入于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <LogIn className="w-5 h-5 text-primary" />
                </button>
              ))}
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-textPrimary/50 font-body">或者</span>
              </div>
            </div>

            <button
              onClick={() => setMode('create')}
              className="w-full flex items-center justify-center gap-2 p-3 bg-primary text-white font-body font-bold rounded-clay shadow-clay hover:shadow-clay-pressed transition-all duration-200 cursor-pointer"
            >
              <UserPlus className="w-5 h-5" />
              创建新用户
            </button>
          </>
        ) : (
          <>
            {/* 创建新用户 */}
            <div className="space-y-4">
              <div>
                <label className="block font-body text-sm text-textPrimary/70 mb-2">
                  你的昵称
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入昵称..."
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-clay border-2 border-background focus:border-primary outline-none font-body text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-body text-sm text-textPrimary/70 mb-2">
                  选择头像
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      className={`
                        text-2xl p-2 rounded-clay transition-all duration-200 cursor-pointer
                        ${avatar === emoji 
                          ? 'bg-primary/20 shadow-clay scale-110' 
                          : 'bg-background hover:bg-primary/10'
                        }
                      `}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateUser}
                disabled={!name.trim()}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-body font-bold text-lg rounded-clay shadow-clay hover:shadow-clay-pressed transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                开始学习
              </button>

              {existingUsers.length > 0 && (
                <button
                  onClick={() => setMode('select')}
                  className="w-full py-2 text-sm font-body text-textPrimary/60 hover:text-primary transition-colors cursor-pointer"
                >
                  返回用户列表
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
