<script setup>
import Icon from './Icon.vue'
import { profile } from '../data/content'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-slate-800 bg-slate-950 text-slate-400">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div class="flex flex-col justify-between gap-10 md:flex-row">
        <!-- 品牌 -->
        <div class="max-w-sm">
          <div class="flex items-center gap-2.5">
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-blue-400">
              <svg
                width="16"
                height="16"
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
            <span class="text-base font-semibold text-white">{{ profile.name }}</span>
          </div>
          <p class="mt-3 text-sm leading-relaxed">{{ profile.tagline }}</p>
        </div>

        <!-- 快速导航 -->
        <div>
          <h4 class="text-sm font-semibold text-white">快速导航</h4>
          <ul class="mt-3 space-y-2 text-sm">
            <li><router-link to="/projects" class="transition hover:text-white">项目作品集</router-link></li>
            <li><router-link to="/skills" class="transition hover:text-white">技能栈</router-link></li>
            <li><router-link to="/about" class="transition hover:text-white">关于我</router-link></li>
          </ul>
        </div>

        <!-- 联系方式 -->
        <div>
          <h4 class="text-sm font-semibold text-white">联系方式</h4>
          <div class="mt-3 space-y-2 text-sm">
            <a
              :href="`mailto:${profile.email}`"
              class="flex items-center gap-2 transition hover:text-white"
            >
              <Icon name="mail" :size="16" />
              {{ profile.email }}
            </a>
            <a
              v-if="profile.github"
              :href="profile.github"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-2 transition hover:text-white"
            >
              <Icon name="github" :size="16" />
              GitHub
            </a>
            <a
              v-if="profile.linkedin"
              :href="profile.linkedin"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-2 transition hover:text-white"
            >
              <Icon name="linkedin" :size="16" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div class="mt-10 flex flex-col items-start justify-between gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
        <p>© {{ year }} {{ profile.name }} · 个人作品集</p>
        <p>纯静态站点 · Vite + Vue 3 + TailwindCSS · 无需后端</p>
      </div>
    </div>
  </footer>
</template>
