<script setup>
import PageHeader from '../components/PageHeader.vue'
import Icon from '../components/Icon.vue'
import { useContent, ui } from '../i18n'

const c = useContent()
</script>

<template>
  <div>
    <PageHeader
      kicker="Skills"
      :title="ui.skillsTitle"
      :description="ui.skillsDesc"
    />

    <section class="bg-slate-50 py-12 sm:py-16">
      <div class="mx-auto max-w-5xl space-y-8 px-4 sm:px-6">
        <!-- Programming languages -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="code" :size="22" class="text-blue-600" />
            {{ ui.programmingLanguages }}
          </h3>
          <div class="mt-6 space-y-6">
            <div v-for="l in c.skills.languages" :key="l.name">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-slate-800">{{ l.name }}</span>
                <span class="text-slate-500">{{ l.level }}</span>
              </div>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div class="h-full rounded-full bg-blue-600" :style="{ width: l.pct + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tools & frameworks -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="database" :size="22" class="text-blue-600" />
            {{ ui.toolsFrameworks }}
          </h3>
          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="t in c.skills.tools"
              :key="t"
              class="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
            >
              {{ t }}
            </span>
          </div>
        </div>

        <!-- Business capabilities -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="sparkles" :size="22" class="text-blue-600" />
            {{ ui.businessCapabilities }}
          </h3>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div
              v-for="b in c.skills.business"
              :key="b.title"
              class="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <h4 class="font-medium text-slate-900">{{ b.title }}</h4>
              <p class="mt-1.5 text-sm leading-relaxed text-slate-600">{{ b.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
