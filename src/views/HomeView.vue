<script setup>
import Icon from '../components/Icon.vue'
import SectionHeader from '../components/SectionHeader.vue'
import { useContent, ui } from '../i18n'

const c = useContent()
</script>

<template>
  <div>
    <!-- ============ Hero ============ -->
    <section class="relative overflow-hidden bg-slate-950 text-white">
      <div class="tech-grid-bg absolute inset-0"></div>
      <div class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl"></div>

      <div class="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p
          class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300"
        >
          <Icon name="map-pin" :size="14" />
          {{ ui.locationTarget }}：{{ c.profile.location }}
        </p>

        <h1 class="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {{ c.profile.name }}
        </h1>
        <p class="mt-4 text-lg font-medium text-blue-400 sm:text-xl">
          {{ c.profile.name }} · {{ c.profile.role.split(' · ')[0] }}
        </p>
        <p class="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
          {{ c.profile.intro }}
        </p>

        <!-- Job intent -->
        <div class="mt-8">
          <p class="text-sm font-semibold text-slate-400">{{ ui.jobIntent }}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="j in c.jobIntent"
              :key="j"
              class="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-300"
            >
              {{ j }}
            </span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="mt-9 flex flex-wrap gap-3">
          <a
            :href="c.profile.resumeUrl"
            download
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Icon name="download" :size="18" />
            {{ ui.downloadResume }}
          </a>
          <router-link
            to="/projects"
            class="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {{ ui.viewProjects }}
            <Icon name="arrow-right" :size="18" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- ============ Featured projects ============ -->
    <section class="bg-white py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader :title="ui.featuredProjects" :subtitle="ui.featuredSubtitle" />
        <div class="mt-10 grid gap-6 sm:grid-cols-2">
          <router-link
            v-for="p in c.projects"
            :key="p.id"
            to="/projects"
            class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          >
            <span class="self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {{ p.tag }}
            </span>
            <h3 class="mt-4 text-lg font-bold text-slate-900 transition group-hover:text-blue-600">
              {{ p.title }}
            </h3>
            <p class="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
              {{ p.desc }}
            </p>
            <div class="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600">
              {{ ui.viewDetails }}
              <Icon name="arrow-right" :size="16" />
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ============ Skills overview ============ -->
    <section class="bg-slate-50 py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader :title="ui.skillsOverview" :subtitle="ui.skillsSubtitle" />
        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <div
            v-for="g in c.skills.groups"
            :key="g.title"
            class="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md"
          >
            <Icon :name="g.icon" :size="26" class="text-blue-600" />
            <h3 class="mt-3 text-base font-semibold text-slate-900">{{ g.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-500">{{ g.summary }}</p>
          </div>
        </div>
        <div class="mt-8 text-center">
          <router-link
            to="/skills"
            class="inline-flex items-center gap-1.5 font-medium text-blue-600 transition hover:text-blue-700"
          >
            {{ ui.viewFullSkills }}
            <Icon name="arrow-right" :size="16" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- ============ Contact CTA ============ -->
    <section class="bg-slate-950 py-16">
      <div class="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {{ ui.contactCta }}
        </h2>
        <p class="mt-3 text-slate-400">{{ c.profile.tagline }}。{{ ui.contactCtaDesc }}</p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <a
            :href="`mailto:${c.profile.email}`"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Icon name="mail" :size="18" />
            {{ c.profile.email }}
          </a>
          <a
            :href="c.profile.resumeUrl"
            download
            class="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Icon name="file-text" :size="18" />
            {{ ui.downloadResume }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
