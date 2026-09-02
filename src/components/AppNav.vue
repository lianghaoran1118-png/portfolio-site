<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'
import { useContent, lang, setLang, ui } from '../i18n'

const c = useContent()
const open = ref(false)
const links = [
  { to: '/', key: 'navHome' },
  { to: '/projects', key: 'navProjects' },
  { to: '/skills', key: 'navSkills' },
  { to: '/about', key: 'navAbout' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
    <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2.5">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-blue-400">
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
        <span class="text-base font-semibold text-slate-900">{{ c.profile.name }}</span>
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
          {{ ui[l.key] }}
        </router-link>
        <!-- 语言切换 -->
        <div class="ml-3 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          <button
            @click="setLang('zh')"
            :class="[
              'rounded-md px-2.5 py-1 text-xs font-medium transition',
              lang === 'zh' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700',
            ]"
          >
            中
          </button>
          <button
            @click="setLang('en')"
            :class="[
              'rounded-md px-2.5 py-1 text-xs font-medium transition',
              lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700',
            ]"
          >
            EN
          </button>
        </div>
        <a
          :href="c.profile.resumeUrl"
          download
          class="ml-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Icon name="download" :size="16" />
          {{ ui.downloadResume }}
        </a>
      </div>

      <!-- 移动端菜单按钮 -->
      <div class="flex items-center gap-2 md:hidden">
        <div class="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          <button
            @click="setLang('zh')"
            :class="[
              'rounded-md px-2.5 py-1 text-xs font-medium transition',
              lang === 'zh' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500',
            ]"
          >
            中
          </button>
          <button
            @click="setLang('en')"
            :class="[
              'rounded-md px-2.5 py-1 text-xs font-medium transition',
              lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500',
            ]"
          >
            EN
          </button>
        </div>
        <button
          @click="open = !open"
          class="rounded-md p-2 text-slate-600 transition hover:bg-slate-100"
          :aria-label="open ? 'close menu' : 'open menu'"
        >
          <Icon :name="open ? 'x' : 'menu'" :size="24" />
        </button>
      </div>
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
        {{ ui[l.key] }}
      </router-link>
      <a
        :href="c.profile.resumeUrl"
        download
        class="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <Icon name="download" :size="16" />
        {{ ui.downloadResume }}
      </a>
    </div>
  </header>
</template>
