import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// 说明：base 设为 './' 相对路径，构建产物可直接部署到 GitHub Pages 的子路径（如 /用户名/仓库名/），无需额外配置
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: './',
})
