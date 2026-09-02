<script setup>
import Icon from './Icon.vue'
import { ui } from '../i18n'

defineProps({
  // 占位说明文字，例如"应收看板效果截图" / "AR dashboard screenshot"
  label: { type: String, required: true },
  // 真实截图路径：放入 public/images/ 后填写为 images/xxx.png，留空则显示占位框
  src: { type: String, default: '' },
  alt: { type: String, default: 'screenshot' },
})
</script>

<template>
  <!--
    ★★★ 截图占位替换说明 ★★★
    1) 将你的截图放入 public/images/ 目录（例如 project-arboard.png）
    2) 在 src/data/content.js 中找到对应项目，把 imageSrc 改为 "images/project-arboard.png"
    3) 保存后占位框会自动替换为真实图片（无需改组件）
  -->
  <div v-if="src" class="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <img :src="src" :alt="alt" class="aspect-[16/9] w-full object-cover" loading="lazy" />
  </div>
  <div
    v-else
    class="flex aspect-[16/9] items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100"
  >
    <div class="px-6 text-center">
      <Icon name="image" :size="40" class="mx-auto text-slate-400" />
      <p class="mt-4 text-sm font-medium text-slate-500">{{ ui.imagePlaceholder }}</p>
      <p class="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-slate-400">{{ label }}</p>
      <p class="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-slate-400">{{ ui.placeholderHint }}</p>
    </div>
  </div>
</template>
