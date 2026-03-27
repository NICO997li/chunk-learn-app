import { useState } from 'react';
import { UserPlus, LogIn, Sparkles, Trash2, Download, AlertTriangle } from 'lucide-react';
import { UserProfile } from '@/types';
import { getAllUsers, addUser, setCurrentUser, generateUserId, deleteUser, restoreFromCloud } from '@/utils/storage';
import { findUserByName, deleteUserFromCloud } from '@/utils/firebase';

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

    // 先检查云端是否有同名用户（跨设备登录）
    try {
      const cloudUser = await findUserByName(name.trim());
      
      if (cloudUser) {
        // 云端有这个用户，恢复数据（跨设备登录）
        setSyncMessage('找到云端数据，正在同步...');
        
        const user: UserProfile = {
          id: cloudUser.userId,
          name: cloudUser.userName,
          avatar: cloudUser.userAvatar || avatar,
          createdAt: new Date().toISOString(),
        };
        
        // 恢复云端数据到本地
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

    // 云端没有同名用户，创建新用户
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
    // 删除本地数据
    deleteUser(userId);
    
    // 同时删除云端数据
    try {
      await deleteUserFromCloud(userId);
    } catch (e) {
      console.error('删除云端数据失败:', e);
    }
    
    // 刷新列表
    setExistingUsers(getAllUsers());
    setDeleteConfirm(null);
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
                <div key={user.id} className="relative">
                  <button
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
                  
                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(user.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-red-100 transition-colors cursor-pointer"
                    title="删除账号"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
                  </button>

                  {/* 删除确认弹窗 */}
                  {deleteConfirm === user.id && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-clay-lg shadow-clay-lg max-w-sm w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-textPrimary">删除账号</h3>
                            <p className="text-sm font-body text-textPrimary/60">
                              确定删除 <strong>{user.name}</strong> 的所有数据？
                            </p>
                          </div>
                        </div>
                        <p className="text-xs font-body text-red-500 mb-4">
                          此操作不可恢复，本地和云端数据都将被删除！
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1 py-2.5 bg-background text-textPrimary font-body font-bold rounded-clay hover:bg-background/80 transition-all cursor-pointer"
                          >
                            取消
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex-1 py-2.5 bg-red-500 text-white font-body font-bold rounded-clay shadow-clay hover:bg-red-600 transition-all cursor-pointer"
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
            {/* 创建新用户 / 跨设备登录 */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-clay p-3">
                <div className="flex items-center gap-2 text-sm font-body text-blue-700">
                  <Download className="w-4 h-4 flex-shrink-0" />
                  <span>输入已有的昵称可自动恢复云端数据（跨设备登录）</span>
                </div>
              </div>

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

              {syncMessage && (
                <div className="text-center py-2">
                  <p className="text-sm font-body text-primary animate-pulse">{syncMessage}</p>
                </div>
              )}

              <button
                onClick={handleCreateUser}
                disabled={!name.trim() || syncing}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-body font-bold text-lg rounded-clay shadow-clay hover:shadow-clay-pressed transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncing ? '同步中...' : '开始学习'}
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
