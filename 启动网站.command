#!/bin/bash
# ============================================================
#  个人作品集网站 · 一键启动本地预览（macOS）
#  用法：在访达里双击本文件即可
# ============================================================
cd "$(dirname "$0")" || exit 1

echo "=========================================="
echo "   个人作品集网站 · 本地预览"
echo "=========================================="
echo

# 1. 检查 Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "❌ 未检测到 Node.js"
  echo
  echo "   请先安装 Node.js（任选一种）："
  echo "   1) 打开 https://nodejs.org 下载 LTS 版安装"
  echo "   2) 或在终端运行：brew install node"
  echo
  read -n 1 -s -r -p "按任意键关闭此窗口..."
  exit 1
fi

echo "✅ Node.js 版本：$(node -v)"
echo

# 2. 首次运行自动安装依赖
if [ ! -d node_modules ]; then
  echo "📦 首次运行，正在安装依赖（约 1 分钟，请稍候）..."
  echo
  if ! npm install; then
    echo
    echo "❌ 依赖安装失败，请检查网络后重试。"
    read -n 1 -s -r -p "按任意键关闭此窗口..."
    exit 1
  fi
  echo
fi

# 3. 启动开发服务器（--open 会自动打开浏览器，端口被占用时自动换端口）
echo "🚀 正在启动，浏览器会自动打开网站..."
echo
echo "   · 修改 src/data/content.js 等文件后，网页会自动刷新"
echo "   · 关闭这个终端窗口即可停止网站"
echo
echo "------------------------------------------"

npm run dev -- --open
