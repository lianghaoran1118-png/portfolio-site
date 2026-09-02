<script setup>
import Icon from './Icon.vue'
import { useContent, ui } from '../i18n'

const c = useContent()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-slate-800 bg-slate-950 text-slate-400">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div class="flex flex-col justify-between gap-10 md:flex-row">
        <!-- Brand -->
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
            <span class="text-base font-semibold text-white">{{ c.profile.name }}</span>
          </div>
          <p class="mt-3 text-sm leading-relaxed">{{ c.profile.tagline }}</p>
        </div>

        <!-- Quick links -->
        <div>
          <h4 class="text-sm font-semibold text-white">{{ ui.quickNav }}</h4>
          <ul class="mt-3 space-y-2 text-sm">
            <li><router-link to="/projects" class="transition hover:text-white">{{ ui.projectsPage }}</router-link></li>
            <li><router-link to="/skills" class="transition hover:text-white">{{ ui.skillsPage }}</router-link></li>
            <li><router-link to="/about" class="transition hover:text-white">{{ ui.aboutPage }}</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-sm font-semibold text-white">{{ ui.contact }}</h4>
          <div class="mt-3 space-y-2 text-sm">
            <a
              :href="`mailto:${c.profile.email}`"
              class="flex items-center gap-2 transition hover:text-white"
            >
              <Icon name="mail" :size="16" />
              {{ c.profile.email }}
            </a>
            <a
              v-if="c.profile.github"
              :href="c.profile.github"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-2 transition hover:text-white"
            >
              <Icon name="github" :size="16" />
              GitHub
            </a>
            <a
              v-if="c.profile.linkedin"
              :href="c.profile.linkedin"
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
        <p>© {{ year }} {{ c.profile.name }} · {{ ui.allRights }}</p>
        <p>{{ ui.footerTag }}</p>
      </div>
    </div>
  </footer>
</template>
