<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'
import { profile } from '../data/content'

const open = ref(false)
const links = [
  { to: '/', label: '首页' },
  { to: '/projects', label: '项目作品集' },
  { to: '/skills', label: '技能栈' },
  { to: '/about', label: '关于我' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
    <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2.5">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-blue-400"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </span>
        <span class="text-base font-semibold text-slate-900">{{ profile.name }}</span>
      </router-link>

      <!-- 桌面端导航 -->
      <div class="hidden items-center gap-1 md:flex">
        <router-link
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          exact-active-class="!text-blue-600 !font-semibold"
        >
          {{ l.label }}
        </router-link>
        <a
          :href="profile.resumeUrl"
          download
          class="ml-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Icon name="download" :size="16" />
          下载简历
        </a>
      </div>

      <!-- 移动端菜单按钮 -->
      <button
        @click="open = !open"
        class="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
        :aria-label="open ? '关闭菜单' : '打开菜单'"
      >
        <Icon :name="open ? 'x' : 'menu'" :size="24" />
      </button>
    </nav>

    <!-- 移动端菜单 -->
    <div v-if="open" class="border-t border-slate-200 bg-white px-4 pb-5 pt-2 md:hidden">
      <router-link
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        @click="open = false"
        class="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        exact-active-class="!text-blue-600 !font-semibold"
      >
        {{ l.label }}
      </router-link>
      <a
        :href="profile.resumeUrl"
        download
        class="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <Icon name="download" :size="16" />
        下载简历
      </a>
    </div>
  </header>
</template>
