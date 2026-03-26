# ChunkLearn - 语块英语学习应用

<div align="center">

![ChunkLearn](https://img.shields.io/badge/ChunkLearn-语块学习法-4F46E5?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwind-css)

</div>

## 📚 项目简介

ChunkLearn 是一款基于**语块学习法(Lexical Approach)**的现代化英语学习应用。不同于传统的单词记忆方式，本应用通过学习 4-8 个单词的固定搭配，让你在真实语境中掌握单词用法，实现事半功倍的学习效果。

### ✨ 核心特点

- 🎯 **语块记忆** - 记住固定搭配，而非孤立单词
- 🧠 **智能复习** - SM-2 间隔重复算法，科学安排复习时间
- 📊 **进度追踪** - 可视化学习统计，激励持续学习
- 🎨 **现代设计** - Claymorphism 风格，趣味性与专业性并存
- 🔊 **语音朗读** - Web Speech API，随时练习发音
- 📱 **响应式** - 完美适配桌面和移动设备

## 🚀 快速开始

### 📱 在线部署(推荐)

**想在 iPhone 上像 App 一样使用?** 

👉 **查看详细部署指南: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

支持一键部署到:
- ✅ **Vercel** (推荐,最简单)
- ✅ **Netlify** (国内访问较好)
- ✅ **Cloudflare Pages** (速度最快)
- ✅ **GitHub Pages**

---

### 💻 本地开发

### 前置要求

- Node.js 18+ 或 20+
- npm 或 yarn

### 安装依赖

\`\`\`bash
npm install
# 或
yarn install
\`\`\`

### 开发模式

\`\`\`bash
npm run dev
# 或
yarn dev
\`\`\`

应用将在 http://localhost:5173 启动

### 生产构建

\`\`\`bash
npm run build
# 或
yarn build
\`\`\`

构建产物将生成在 `dist/` 目录

### 预览生产构建

\`\`\`bash
npm run preview
# 或
yarn preview
\`\`\`

## 📖 使用指南

### 学习流程

1. **首页** - 了解语块学习法，查看今日待复习数量
2. **开始学习** - 点击"开始学习"按钮进入复习模式
3. **翻阅卡片** - 点击卡片查看翻译和详细解释
4. **选择反馈** - 根据记忆程度选择四种反馈之一：
   - ❌ **完全忘记** - 1天后复习
   - 😟 **有点难** - 3天后复习
   - 😊 **记得** - 7天后复习
   - ⚡ **轻松** - 14天后复习
5. **查看统计** - 在"统计"页面查看学习进度和成就

### 语块示例

```
语块: get the hang of
翻译: 掌握...的窍门
例句: Don't worry, you'll get the hang of it soon.
例句翻译: 别担心,你很快就会掌握窍门的。
```

## 🏗️ 技术架构

### 技术栈

- **前端框架**: React 18.3 + TypeScript
- **构建工具**: Vite 5.1
- **样式方案**: Tailwind CSS 3.4
- **图标库**: Lucide React
- **语音合成**: Web Speech API
- **数据持久化**: LocalStorage

### 项目结构

```
chunk-learn-app/
├── src/
│   ├── components/        # React 组件
│   │   ├── ChunkCard.tsx      # 学习卡片组件
│   │   ├── ReviewButtons.tsx  # 复习反馈按钮
│   │   └── StatsCard.tsx      # 统计卡片
│   ├── hooks/             # 自定义 Hooks
│   │   └── useLearning.ts     # 学习状态管理
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts
│   ├── data/              # 数据文件
│   │   └── chunks.ts          # 语块数据
│   ├── utils/             # 工具函数
│   │   ├── spaced-repetition.ts  # SM-2 算法
│   │   └── storage.ts            # 本地存储
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 入口文件
│   └── index.css          # 全局样式
├── public/                # 静态资源
├── index.html            # HTML 入口
├── package.json
├── vite.config.ts        # Vite 配置
├── tailwind.config.js    # Tailwind 配置
└── tsconfig.json         # TypeScript 配置
```

### 核心算法

#### SM-2 间隔重复算法

基于 SuperMemo 2 算法实现，通过以下因素动态调整复习间隔：

- **难度因子(Ease Factor)**: 初始值 2.5，范围 1.3-2.5
- **复习间隔(Interval)**: 根据反馈和难度因子计算
- **复习次数(Review Count)**: 影响间隔增长速度

```typescript
反馈类型 → 难度因子调整 → 间隔计算 → 下次复习日期
```

## 🎨 设计系统

### 配色方案

- **主色调**: #4F46E5 (Indigo)
- **辅助色**: #818CF8 (Light Indigo)
- **强调色**: #22C55E (Green)
- **背景色**: #EEF2FF (Light Indigo)
- **文本色**: #312E81 (Dark Indigo)

### 字体

- **标题**: Baloo 2 (圆润友好)
- **正文**: Comic Neue (轻松易读)

### 设计风格

采用 **Claymorphism** (黏土风格)，特点包括：
- 柔和的 3D 效果
- 厚实的边框 (3-4px)
- 双层阴影
- 大圆角 (16-24px)

## 📊 数据模型

### Chunk (语块)

```typescript
interface Chunk {
  id: string;
  text: string;              // 语块文本
  translation: string;       // 中文翻译
  targetWord: string;        // 目标单词
  example: string;           // 例句
  exampleTranslation: string;// 例句翻译
  category: ChunkCategory;   // 分类
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
```

### LearningRecord (学习记录)

```typescript
interface LearningRecord {
  chunkId: string;
  status: 'new' | 'learning' | 'mastered';
  reviewCount: number;
  lastReviewDate: Date;
  nextReviewDate: Date;
  easeFactor: number;
  interval: number;
}
```

## 🔧 扩展开发

### 添加新语块

编辑 `src/data/chunks.ts`，添加新的语块对象：

```typescript
{
  id: '16',
  text: 'your new chunk',
  translation: '你的新语块翻译',
  targetWord: 'key word',
  example: 'Example sentence here.',
  exampleTranslation: '例句翻译',
  category: 'daily-life',
  difficulty: 'beginner',
}
```

### 自定义主题

修改 `tailwind.config.js` 中的颜色配置：

```javascript
colors: {
  primary: '#YOUR_COLOR',
  secondary: '#YOUR_COLOR',
  // ...
}
```

## 📱 部署

### Vercel

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages

```bash
npm run build
# 将 dist/ 目录内容推送到 gh-pages 分支
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- 灵感来源: [块块英语](https://www.chunklearner.com/)
- 设计系统: UI/UX Pro Max
- 图标库: Lucide Icons

## 📮 联系方式

如有问题或建议，欢迎通过 GitHub Issues 联系。

---

**记住：语块学习法的核心是在语境中记忆，而非孤立背单词。坚持每天复习，你会看到显著进步！** 🚀
