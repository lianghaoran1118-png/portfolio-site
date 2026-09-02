<script setup>
import { ref } from 'vue'
import { ui } from '../i18n'

defineProps({
  title: { type: String, required: true }, // 代码片段标题，如"核心系统提示词"
  lang: { type: String, default: '' },     // 语言标签，如 python / sql / text
  code: { type: String, required: true },
})

const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch (e) {
    // 剪贴板不可用（如非 HTTPS 环境）时静默失败，不影响页面
  }
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <!-- 代码块标题栏 -->
    <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
      <div class="flex items-center gap-2.5">
        <span class="flex gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-red-400"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
        </span>
        <span class="ml-1 text-xs font-medium text-slate-600">{{ title }}</span>
        <span
          v-if="lang"
          class="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600"
        >
          {{ lang }}
        </span>
      </div>
      <button
        @click="copy"
        class="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
      >
        {{ copied ? ui.copied + ' ✓' : ui.copy }}
      </button>
    </div>
    <!-- 代码内容 -->
    <pre
      class="code-scroll overflow-x-auto bg-slate-900 p-4 text-[13px] leading-relaxed text-slate-100"
    ><code class="font-mono">{{ code }}</code></pre>
  </div>
</template>
