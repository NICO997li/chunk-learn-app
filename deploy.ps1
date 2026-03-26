# 快速部署脚本
# 适用于 Windows PowerShell

Write-Host "🚀 ChunkLearn 快速部署到 Vercel" -ForegroundColor Green
Write-Host ""

# 检查 Node.js
Write-Host "检查 Node.js 环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 未检测到 Node.js,请先安装: https://nodejs.org" -ForegroundColor Red
    exit 1
}

# 检查 Git
Write-Host "检查 Git 环境..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git 版本: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 未检测到 Git,请先安装: https://git-scm.com" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "环境检查完成!" -ForegroundColor Green
Write-Host ""

# 提示用户
Write-Host "接下来需要:" -ForegroundColor Cyan
Write-Host "1. GitHub 账号 (https://github.com)" -ForegroundColor White
Write-Host "2. Vercel 账号 (https://vercel.com)" -ForegroundColor White
Write-Host ""

$continue = Read-Host "是否继续? (y/n)"
if ($continue -ne "y") {
    Write-Host "已取消" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "📦 安装依赖..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🔨 构建项目..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "✅ 构建完成!" -ForegroundColor Green
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Cyan
Write-Host "1. 初始化 Git 仓库: git init" -ForegroundColor White
Write-Host "2. 提交代码: git add . && git commit -m 'Initial commit'" -ForegroundColor White
Write-Host "3. 推送到 GitHub: git remote add origin <你的仓库地址>" -ForegroundColor White
Write-Host "4. 在 Vercel 导入 GitHub 项目" -ForegroundColor White
Write-Host ""
Write-Host "详细步骤请查看: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
