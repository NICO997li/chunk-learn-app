# ChunkLearn 在线部署指南 🚀

## 📱 最终效果

完成后,你将获得:
- ✅ 一个在线地址(例如: `https://chunk-learn-app.vercel.app`)
- ✅ iPhone 上可以像 App 一样使用
- ✅ 学习进度自动保存在手机上
- ✅ 随时随地访问,无需电脑

---

## 🎯 部署步骤(5分钟搞定)

### 方式一: 通过 Vercel 网站部署(最简单,推荐)

#### 步骤1: 准备 GitHub 仓库

1. **打开 GitHub**: https://github.com
   - 如果没账号,点击 "Sign up" 免费注册
   - 已有账号直接登录

2. **创建新仓库**:
   - 点击右上角 `+` → `New repository`
   - Repository name: `chunk-learn-app`
   - 选择 `Public`(公开)
   - 点击 `Create repository`

3. **上传代码到 GitHub**:
   
   在**本地项目目录**打开命令行(PowerShell),执行:

   ```bash
   cd c:\Users\v_miehli\WorkBuddy\20260325092005\chunk-learn-app
   
   # 初始化 Git
   git init
   git add .
   git commit -m "Initial commit: ChunkLearn App"
   
   # 连接远程仓库(替换 YOUR_USERNAME 为你的 GitHub 用户名)
   git remote add origin https://github.com/YOUR_USERNAME/chunk-learn-app.git
   git branch -M main
   git push -u origin main
   ```

   **提示**: 第一次 push 可能需要输入 GitHub 用户名和密码/Token

#### 步骤2: 部署到 Vercel

1. **打开 Vercel**: https://vercel.com
   - 点击 `Sign Up`(注册)
   - 选择 `Continue with GitHub`(用 GitHub 登录)
   - 授权 Vercel 访问你的 GitHub

2. **导入项目**:
   - 进入 Vercel 控制台
   - 点击 `Add New...` → `Project`
   - 找到 `chunk-learn-app` 仓库
   - 点击 `Import`

3. **配置部署**(使用默认配置即可):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **点击 Deploy**:
   - 等待 1-2 分钟,构建完成
   - 🎉 成功! Vercel 会给你一个在线地址

#### 步骤3: 获取在线地址

部署成功后:
- Vercel 会显示: `https://chunk-learn-app-xxxx.vercel.app`
- 点击 `Visit` 测试网站
- 可以在 `Domains` 设置自定义域名(可选)

---

### 方式二: 通过命令行部署(程序员专用)

如果你熟悉命令行,可以使用这种方式:

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 在项目目录部署
cd c:\Users\v_miehli\WorkBuddy\20260325092005\chunk-learn-app
vercel

# 4. 按提示操作:
#    - Set up and deploy? Y
#    - Which scope? (选择你的账号)
#    - Link to existing project? N
#    - What's your project's name? chunk-learn-app
#    - In which directory is your code located? ./
#    - Want to override the settings? N

# 5. 部署到生产环境
vercel --prod
```

---

## 📱 在 iPhone 上添加到主屏幕

### 步骤:

1. **打开 Safari 浏览器**
   - 输入 Vercel 给你的地址(例如 `https://chunk-learn-app.vercel.app`)
   - 确认网站正常显示

2. **添加到主屏幕**:
   - 点击底部**分享按钮**(方框+向上箭头图标)
   - 向下滚动,找到 **"添加到主屏幕"**
   - 点击进入

3. **自定义图标**:
   - 名称输入: `ChunkLearn` 或 `语块英语`
   - 点击右上角 **"添加"**

4. **完成!** 🎉
   - 回到主屏幕,你会看到新图标
   - 点击图标,全屏打开应用
   - 学习进度会自动保存在手机上

---

## 🔧 常见问题

### Q1: 我没有 GitHub 账号怎么办?
**A**: 去 https://github.com 免费注册,只需要邮箱,1分钟搞定。

### Q2: git push 时提示需要密码?
**A**: GitHub 已不支持密码登录,需要使用 Personal Access Token:
1. GitHub 设置 → Developer settings → Personal access tokens → Generate new token
2. 选择 `repo` 权限
3. 复制 Token,代替密码使用

### Q3: Vercel 部署失败?
**A**: 检查:
1. `package.json` 中的依赖是否完整
2. Node.js 版本是否兼容(推荐 18.x 或 20.x)
3. 查看 Vercel 控制台的构建日志

### Q4: 手机访问很慢?
**A**: Vercel 在国内访问可能较慢,可以考虑:
- Netlify (备选方案)
- Cloudflare Pages (备选方案)
- 自己的服务器 + OSS

### Q5: 如何更新应用?
**A**: 只需要:
```bash
# 修改代码后
git add .
git commit -m "Update features"
git push

# Vercel 会自动重新部署,1-2分钟后生效
```

---

## 🎯 备选方案: Netlify 部署

如果 Vercel 不好用,试试 Netlify:

### 方法1: Drag & Drop(最简单)

1. 在本地构建:
   ```bash
   cd chunk-learn-app
   npm install
   npm run build
   ```

2. 打开 https://app.netlify.com/drop
3. 拖拽 `dist` 文件夹到页面
4. 立即获得在线地址!

### 方法2: 连接 GitHub

1. 打开 https://app.netlify.com
2. 用 GitHub 登录
3. `New site from Git` → 选择 `chunk-learn-app` 仓库
4. 构建设置:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击 Deploy

---

## 📊 部署对比

| 平台 | 速度 | 国内访问 | 免费额度 | 难度 |
|------|------|----------|----------|------|
| **Vercel** | ⚡⚡⚡ | 😐 中等 | 100GB/月 | ⭐ 简单 |
| **Netlify** | ⚡⚡ | 😊 较好 | 100GB/月 | ⭐ 简单 |
| **GitHub Pages** | ⚡ | 😐 中等 | 1GB | ⭐⭐ 中等 |
| **Cloudflare Pages** | ⚡⚡⚡ | 😊 快 | 无限 | ⭐⭐ 中等 |

---

## 🎉 部署成功后

你将拥有:
- ✅ 一个专属的在线英语学习应用
- ✅ iPhone 上像原生 App 一样使用
- ✅ 数据保存在本地,隐私安全
- ✅ 可以分享给朋友使用

**开始你的语块学习之旅吧!** 📚✨

---

需要帮助? 随时问我!
