import { useState } from 'react';
import { UserPlus, LogIn, Sparkles, Trash2, Download, AlertTriangle } from 'lucide-react';
import { UserProfile } from '@/types';
import { getAllUsers, addUser, setCurrentUser, generateUserId, deleteUser, restoreFromCloud } from '@/utils/storage';
import { findUserByName, deleteUserFromCloud } from '@/utils/firebase';
import { BrushLogo } from './BrushLogo';

interface UserSelectProps {
  onUserSelected: (user: UserProfile) => void;
}

const AVATARS = ['😊', '😎', '🌟', '🦄', '🐱', '🐶', '🌸', '🎯', '🚀', '💪', '🎵', '❤️'];

export function UserSelect({ onUserSelected }: UserSelectProps) {
  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('😊');
  const [existingUsers, setExistingUsers] = useState(getAllUsers());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const handleCreateUser = async () => {
    if (!name.trim()) return;

    setSyncing(true);
    setSyncMessage('正在检查云端数据...');

    try {
      const cloudUser = await findUserByName(name.trim());

      if (cloudUser) {
        setSyncMessage('找到云端数据，正在同步...');

        const user: UserProfile = {
          id: cloudUser.userId,
          name: cloudUser.userName,
          avatar: cloudUser.userAvatar || avatar,
          createdAt: new Date().toISOString(),
        };

        restoreFromCloud(cloudUser.userId, cloudUser.records, cloudUser.dailyGoal);
        addUser(user);
        setCurrentUser(user);
        setSyncing(false);
        onUserSelected(user);
        return;
      }
    } catch (e) {
      console.error('云端检查失败，继续创建本地用户:', e);
    }

    const newUser: UserProfile = {
      id: generateUserId(),
      name: name.trim(),
      avatar,
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);
    setCurrentUser(newUser);
    setSyncing(false);
    onUserSelected(newUser);
  };

  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    onUserSelected(user);
  };

  const handleDeleteUser = async (userId: string) => {
    deleteUser(userId);
    try {
      await deleteUserFromCloud(userId);
    } catch (e) {
      console.error('删除云端数据失败:', e);
    }
    setExistingUsers(getAllUsers());
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative max-w-md w-full animate-fade-in-up">
        {/* 装饰光晕 */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative glass rounded-clay-xl shadow-clay-lg p-6">
          {/* 顶部 Logo */}
          <div className="text-center mb-6 relative">
            {/* 装饰小元素 */}
            <span className="absolute top-0 left-2 text-xl animate-float opacity-70">✨</span>
            <span className="absolute top-2 right-2 text-xl animate-float-slow opacity-70">🎈</span>

            <div className="w-16 h-16 mx-auto mb-3 rounded-clay-lg flex items-center justify-center shadow-glow-primary animate-bounce-soft" style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 50%, #FFD93D 100%)',
            }}>
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <BrushLogo size="md" className="mb-1" />
            <p className="text-sm font-medium text-textSecondary mt-2">
              语块记忆法 · 像母语者一样说英语
            </p>
          </div>

          {mode === 'select' && existingUsers.length > 0 ? (
            <>
              <div className="space-y-2.5 mb-4">
                {existingUsers.map((user) => (
                  <div key={user.id} className="relative">
                    <button
                      onClick={() => handleSelectUser(user)}
                      className="w-full flex items-center gap-3 p-3.5 bg-white/70 hover:bg-white/95 rounded-clay btn-press transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-warm flex items-center justify-center text-2xl shadow-soft">
                        {user.avatar}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-bold text-textPrimary truncate">{user.name}</p>
                        <p className="text-[11px] text-textSecondary">
                          加入于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      <LogIn className="w-5 h-5 text-primary flex-shrink-0" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(user.id);
                      }}
                      className="absolute top-2 right-12 p-1.5 rounded-full hover:bg-red-100 transition-colors"
                      title="删除账号"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>

                    {deleteConfirm === user.id && (
                      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-clay-xl shadow-clay-lg max-w-sm w-full p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                              <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                              <h3 className="font-bold text-textPrimary text-lg">删除账号</h3>
                              <p className="text-sm text-textSecondary">
                                确定删除 <strong>{user.name}</strong> 的所有数据？
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-red-500 mb-4 bg-red-50 p-3 rounded-xl">
                            ⚠️ 此操作不可恢复，本地和云端数据都将被删除！
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="flex-1 py-3 bg-gray-100 text-textPrimary font-bold rounded-2xl btn-press"
                            >
                              取消
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="flex-1 py-3 bg-red-500 text-white font-bold rounded-2xl btn-press"
                            >
                              确认删除
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-textSecondary/15"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white/70 text-textSecondary font-medium">或</span>
                </div>
              </div>

              <button
                onClick={() => setMode('create')}
                className="w-full flex items-center justify-center gap-2 py-3.5 text-white font-bold rounded-clay btn-press shadow-glow-primary"
                style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 100%)' }}
              >
                <UserPlus className="w-5 h-5" />
                创建新用户
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="rounded-clay p-3 flex items-start gap-2"
                style={{ background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15) 0%, rgba(167, 139, 250, 0.15) 100%)' }}>
                <Download className="w-4 h-4 text-secondaryDark flex-shrink-0 mt-0.5" />
                <span className="text-xs text-textPrimary font-medium leading-relaxed">
                  输入已有昵称可自动恢复云端数据（跨设备登录）
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-wider">
                  你的昵称
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入昵称..."
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-clay bg-white/80 border-2 border-transparent focus:border-primary focus:bg-white outline-none text-lg font-medium transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-textSecondary mb-2 uppercase tracking-wider">
                  选择头像
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      className={`
                        text-2xl p-2 rounded-2xl transition-all btn-press
                        ${avatar === emoji
                          ? 'shadow-glow-primary scale-110'
                          : 'bg-white/60 hover:bg-white/90'
                        }
                      `}
                      style={avatar === emoji ? {
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 100%)',
                      } : {}}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {syncMessage && (
                <div className="text-center py-2">
                  <p className="text-sm font-bold text-primary animate-pulse">{syncMessage}</p>
                </div>
              )}

              <button
                onClick={handleCreateUser}
                disabled={!name.trim() || syncing}
                className="w-full py-3.5 text-white font-bold text-lg rounded-clay btn-press shadow-glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 50%, #FFD93D 100%)' }}
              >
                {syncing ? '同步中...' : '🚀 开始学习'}
              </button>

              {existingUsers.length > 0 && (
                <button
                  onClick={() => setMode('select')}
                  className="w-full py-2 text-sm text-textSecondary hover:text-primary font-medium transition-colors"
                >
                  ← 返回用户列表
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
