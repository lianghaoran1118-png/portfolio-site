<script setup>
import { computed } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import Icon from '../components/Icon.vue'
import { useContent, lang, ui } from '../i18n'

const c = useContent()
const industriesText = computed(() =>
  c.value.profile.industries.join(lang.value === 'zh' ? '、' : ', ')
)
</script>

<template>
  <div>
    <PageHeader
      kicker="About"
      :title="ui.aboutTitle"
      :description="`${c.profile.name} · ${c.profile.role}`"
    />

    <section class="bg-slate-50 py-12 sm:py-16">
      <div class="mx-auto max-w-4xl space-y-8 px-4 sm:px-6">
        <!-- Education -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="graduation-cap" :size="22" class="text-blue-600" />
            {{ ui.educationTitle }}
          </h3>
          <div class="mt-5 space-y-5">
            <div v-for="e in c.education" :key="e.school" class="border-l-2 border-blue-600 pl-4">
              <h4 class="font-semibold text-slate-900">{{ e.school }}</h4>
              <p class="text-sm text-slate-600">{{ e.degree }} · {{ e.period }}</p>
              <p v-if="e.detail" class="mt-1 text-sm leading-relaxed text-slate-500">
                {{ e.detail }}
              </p>
            </div>
          </div>
        </div>

        <!-- Internships -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="briefcase" :size="22" class="text-blue-600" />
            {{ ui.internshipsTitle }}
          </h3>
          <div class="mt-5 space-y-5">
            <div v-for="x in c.experiences" :key="x.title" class="border-l-2 border-blue-600 pl-4">
              <h4 class="font-semibold text-slate-900">{{ x.title }}</h4>
              <p class="text-sm text-slate-600">{{ x.org }} · {{ x.period }}</p>
              <ul class="mt-2 space-y-1.5">
                <li
                  v-for="(d, i) in x.items"
                  :key="i"
                  class="flex items-start gap-2 text-sm leading-relaxed text-slate-600"
                >
                  <Icon name="check" :size="14" class="mt-1 shrink-0 text-emerald-500" />
                  {{ d }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Awards -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="award" :size="22" class="text-blue-600" />
            {{ ui.awardsTitle }}
          </h3>
          <div class="mt-5 space-y-5">
            <div v-for="a in c.awards" :key="a.title" class="border-l-2 border-blue-600 pl-4">
              <div class="flex flex-wrap items-center gap-2">
                <h4 class="font-semibold text-slate-900">{{ a.title }}</h4>
                <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
                  {{ a.time }}
                </span>
              </div>
              <p class="mt-1 text-sm leading-relaxed text-slate-500">{{ a.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Job intent -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="target" :size="22" class="text-blue-600" />
            {{ ui.jobIntentTitle }}
          </h3>
          <p class="mt-4 text-sm text-slate-600">{{ ui.targetPositions }}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="j in c.jobIntent"
              :key="j"
              class="rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-700"
            >
              {{ j }}
            </span>
          </div>
          <p class="mt-5 text-sm text-slate-600">
            {{ ui.targetLocation }}：{{ c.profile.location }} · {{ ui.targetIndustry }}：{{ industriesText }}
          </p>
        </div>

        <!-- Contact -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="mail" :size="22" class="text-blue-600" />
            {{ ui.contactInfo }}
          </h3>
          <div class="mt-4 space-y-2.5 text-sm text-slate-600">
            <a
              :href="`tel:${c.profile.phone}`"
              class="flex items-center gap-2 transition hover:text-blue-600"
            >
              <Icon name="phone" :size="16" />
              {{ c.profile.phone }}
            </a>
            <a
              :href="`mailto:${c.profile.email}`"
              class="flex items-center gap-2 transition hover:text-blue-600"
            >
              <Icon name="mail" :size="16" />
              {{ c.profile.email }}
            </a>
            <a
              v-if="c.profile.github"
              :href="c.profile.github"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-2 transition hover:text-blue-600"
            >
              <Icon name="github" :size="16" />
              {{ c.profile.github }}
            </a>
            <a
              v-if="c.profile.linkedin"
              :href="c.profile.linkedin"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-2 transition hover:text-blue-600"
            >
              <Icon name="linkedin" :size="16" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
