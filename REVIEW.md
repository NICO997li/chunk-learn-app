# MeihooStudy 英语学习App — 全流程工作流复盘

## 📋 项目概况

| 项目 | 详情 |
|------|------|
| **产品名** | MeihooStudy / meihoo语块学习 |
| **线上地址** | Vercel: https://chunk-learn-app.vercel.app |
| | Netlify: https://meihao-chunk-learn.netlify.app |
| **开发周期** | 2026年3月25日 ~ 4月8日（持续迭代中） |
| **开发方式** | AI辅助开发（CodeBuddy/WorkBuddy），无需手写代码 |
| **总内容量** | 345个英语语块，7大场景，4个难度等级 |

---

## 🛠️ 用到的网站和工具

### 一、开发环境

| 工具 | 用途 | 地址 |
|------|------|------|
| **CodeBuddy / WorkBuddy** | AI编程助手，负责所有代码编写 | IDE内置 |
| **Node.js 20.18.0** | JavaScript运行环境 | 本地managed版本 |
| **npm** | 包管理器，安装依赖 | 随Node.js自带 |
| **Vite 5** | 前端构建工具，开发服务器+打包 | https://vitejs.dev |
| **TypeScript** | 类型安全的JavaScript | https://www.typescriptlang.org |

### 二、前端框架和库

| 库 | 用途 | 安装方式 |
|---|------|---------|
| **React 18** | UI框架 | `npm install react react-dom` |
| **Tailwind CSS 3** | 原子化CSS样式 | `npm install tailwindcss` |
| **Lucide React** | 图标库（1000+图标） | `npm install lucide-react` |
| **vite-plugin-pwa** | PWA支持（离线使用、添加到桌面） | `npm install vite-plugin-pwa` |
| **Firebase SDK** | 实时数据库云同步 | `npm install firebase` |

### 三、代码托管

| 工具 | 用途 | 地址 |
|------|------|------|
| **GitHub** | 代码仓库，版本管理 | https://github.com |
| | 仓库地址：`NICO997li/chunk-learn-app` | |
| **Git** | 版本控制，每次改动都commit+push | 本地命令行 |

### 四、部署平台（自动化部署）

| 平台 | 用途 | 地址 |
|------|------|------|
| **Vercel** | 主要部署平台，GitHub推送后自动部署 | https://vercel.com |
| **Netlify** | 备用部署平台（国内访问更稳定） | https://app.netlify.com |
| **~~Cloudflare Pages~~** | 尝试过但因Vite版本兼容问题放弃 | https://pages.cloudflare.com |

> 工作流：`git push → GitHub → Vercel/Netlify 自动构建部署 → 2分钟后上线`

### 五、云服务

| 服务 | 用途 | 地址 |
|------|------|------|
| **Firebase Realtime Database** | 多用户学习数据云同步 | https://console.firebase.google.com |
| | 项目名：`meihoo-chunk-learn2` | |
| | 模式：test mode | |
| **~~LeanCloud~~** | 原计划替代Firebase（国内可用），但停止注册 | https://console.leancloud.cn |

### 六、浏览器API（免费，无需注册）

| API | 用途 |
|-----|------|
| **Web Speech API (SpeechSynthesis)** | 文字转语音，朗读英文语块和例句 |
| **Web Speech API (SpeechRecognition)** | 语音识别，跟读功能 |
| **Canvas API** | 生成学习报告图片，一键下载分享 |
| **localStorage** | 本地数据持久化存储（按用户隔离） |

---

## 📐 技术架构图

```
用户手机/电脑浏览器
        │
        ▼
┌──────────────────────────┐
│   React + TypeScript     │  ← 前端框架
│   Tailwind CSS           │  ← 样式
│   Lucide Icons           │  ← 图标
│   PWA (Service Worker)   │  ← 离线支持
├──────────────────────────┤
│   核心功能               │
│   ├─ SM-2 间隔重复算法   │  ← 复习调度
│   ├─ Web Speech API      │  ← 语音朗读+跟读
│   ├─ Canvas API          │  ← 生成报告图片
│   └─ localStorage        │  ← 本地数据存储
├──────────────────────────┤
│   云同步                 │
│   └─ Firebase Realtime DB│  ← 多设备/多用户同步
└──────────────────────────┘
        │
        ▼ (git push自动触发)
┌──────────────────────────┐
│   GitHub 代码仓库         │
│   └─ NICO997li/chunk-learn-app
└──────────────────────────┘
        │              │
        ▼              ▼
┌────────────┐  ┌────────────┐
│  Vercel    │  │  Netlify   │
│  自动部署  │  │  自动部署  │
└────────────┘  └────────────┘
```

---

## 🔄 完整开发流程（时间线）

### 第1阶段：项目初始化（3月25日）
1. 用 Vite 创建 React + TypeScript 项目
2. 配置 Tailwind CSS 样式系统
3. 设计数据结构（Chunk、LearningRecord、LearningStats）
4. 编写 250 个英语语块数据（chunks.json）
5. 实现 SM-2 间隔重复算法
6. 实现基础学习流程（翻转卡片 + 4个反馈按钮）
7. 连接 GitHub 仓库
8. 部署到 Vercel

### 第2阶段：功能完善（3月26-27日）
1. 新增每日学习目标设置
2. 新增今日回看功能
3. 新增学习统计页面
4. 新增语音朗读 + 跟读功能（Web Speech API）
5. 配置 PWA（离线使用、添加到桌面）
6. 手机端布局优化（固定屏幕高度、底部导航栏）
7. 部署到 Netlify（解决国内访问问题）
8. 修复 Netlify 白屏（添加 netlify.toml + base 配置）

### 第3阶段：多用户系统（3月27日）
1. 创建用户选择/注册组件
2. localStorage 按用户ID隔离存储
3. 注册 Firebase 项目（meihoo-chunk-learn2）
4. 接入 Firebase Realtime Database 实现云同步
5. 新增学习看板（多用户排行对比）
6. 新增分享学习报告功能（Canvas 生成图片）
7. 新增删除账号功能（本地+云端同步删除）
8. 新增跨设备登录（同名用户自动恢复云端数据）

### 第4阶段：内容扩充 + 体验优化（3月30日 ~ 4月8日）
1. 新增 40 个家庭亲子中/高级语块（290个）
2. 新增 55 个雅思学术语块（345个）
3. 修复统计页面：区分"已学过"和"已掌握"，双进度条
4. 修复随机打乱队列
5. 今日回看增加例句中文翻译
6. 优化语音引擎选择（优先自然度高的声音）
7. 卡片背面例句增加朗读按钮
8. **拆分"新学"和"复习"功能**（独立按钮、独立队列）

---

## 📱 功能清单（当前版本）

| # | 功能 | 说明 |
|---|------|------|
| 1 | 多用户系统 | 创建/切换/删除用户，跨设备登录 |
| 2 | 新学模式 | 随机推送未学过的新语块 |
| 3 | 复习模式 | 按SM-2算法推送到期复习的语块，显示距今天数 |
| 4 | 翻转卡片 | 正面英文+例句，背面翻译+中文例句 |
| 5 | 4级反馈 | 完全忘记/有点难/记得/轻松，决定下次复习时间 |
| 6 | 语音朗读 | 语块和例句都可朗读，自动选择最自然的声音 |
| 7 | 跟读功能 | 语音识别，用户可跟读练习 |
| 8 | 每日目标 | 可设置每天学习数量 |
| 9 | 今日回看 | 查看今天学过的所有语块（含中英文对照） |
| 10 | 学习统计 | 总语块/已学/已掌握/进度百分比/连续天数 |
| 11 | Firebase云同步 | 学习数据自动同步到云端 |
| 12 | 学习看板 | 多用户排行对比 |
| 13 | 分享报告 | 一键生成学习报告图片 |
| 14 | PWA | 可添加到手机桌面，像原生App一样使用 |

---

## 💡 踩过的坑

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| Netlify 白屏 | vite.config.ts 缺少 `base: '/'` | 添加 base 配置 + netlify.toml |
| Cloudflare 构建失败 | Vite 版本与 Cloudflare 插件不兼容 | 放弃 Cloudflare，改用 Netlify |
| LeanCloud 无法注册 | 平台暂停新用户注册 | 改回 Firebase |
| 语块推送不随机 | useCallback 反复重建队列覆盖洗牌结果 | 用 useRef 标记只初始化一次 |
| 统计"已学"显示0 | "已掌握"门槛太高（需间隔≥21天） | 新增"已学过"字段（reviewCount>0即算） |
| 老婆打不开网站 | 不同运营商对 Vercel 的访问策略不同 | 增加 Netlify 备用部署 |
| 外部服务选型失误 | 默认用了 Firebase（需翻墙） | 教训：优先考虑国内网络可用性 |

---

## 🔑 关键经验总结

1. **AI辅助开发极大降低门槛**：整个项目你不需要写一行代码，通过自然语言描述需求即可完成
2. **GitHub + Vercel/Netlify 实现零运维**：推送代码自动部署，无需管理服务器
3. **PWA 是轻量级App的最佳方案**：免审核、免上架、添加到桌面就像原生App
4. **localStorage + Firebase 的混合存储**：本地保证离线可用，云端实现多设备同步
5. **SM-2 算法是间隔复习的标准方案**：简单有效，被 Anki 等主流记忆软件广泛使用
6. **选型要考虑国内网络环境**：Firebase、Google 等服务在国内不一定稳定

---

*复盘时间：2026年4月8日*
