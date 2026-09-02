<script setup>
import PageHeader from '../components/PageHeader.vue'
import Icon from '../components/Icon.vue'
import { profile, jobIntent, education, experiences, awards } from '../data/content'
</script>

<template>
  <div>
    <PageHeader
      kicker="About"
      title="关于我"
      :description="`${profile.name} · ${profile.role}`"
    />

    <section class="bg-slate-50 py-12 sm:py-16">
      <div class="mx-auto max-w-4xl space-y-8 px-4 sm:px-6">
        <!-- 教育背景 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="graduation-cap" :size="22" class="text-blue-600" />
            教育背景
          </h3>
          <div class="mt-5 space-y-5">
            <div v-for="e in education" :key="e.school" class="border-l-2 border-blue-600 pl-4">
              <h4 class="font-semibold text-slate-900">{{ e.school }}</h4>
              <p class="text-sm text-slate-600">{{ e.degree }} · {{ e.period }}</p>
              <p v-if="e.detail" class="mt-1 text-sm leading-relaxed text-slate-500">
                {{ e.detail }}
              </p>
            </div>
          </div>
        </div>

        <!-- 实习经历 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="briefcase" :size="22" class="text-blue-600" />
            实习经历
          </h3>
          <div class="mt-5 space-y-5">
            <div v-for="x in experiences" :key="x.title" class="border-l-2 border-blue-600 pl-4">
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

        <!-- 荣誉奖项 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="award" :size="22" class="text-blue-600" />
            荣誉奖项
          </h3>
          <div class="mt-5 space-y-5">
            <div v-for="a in awards" :key="a.title" class="border-l-2 border-blue-600 pl-4">
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

        <!-- 求职意向 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="target" :size="22" class="text-blue-600" />
            求职意向
          </h3>
          <p class="mt-4 text-sm text-slate-600">目标岗位</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="j in jobIntent"
              :key="j"
              class="rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-700"
            >
              {{ j }}
            </span>
          </div>
          <p class="mt-5 text-sm text-slate-600">
            意向地区：{{ profile.location }} · 意向行业：{{ profile.industries.join('、') }}
          </p>
        </div>

        <!-- 联系方式 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="mail" :size="22" class="text-blue-600" />
            联系方式
          </h3>
          <div class="mt-4 space-y-2.5 text-sm text-slate-600">
            <a
              :href="`tel:${profile.phone}`"
              class="flex items-center gap-2 transition hover:text-blue-600"
            >
              <Icon name="phone" :size="16" />
              {{ profile.phone }}
            </a>
            <a
              :href="`mailto:${profile.email}`"
              class="flex items-center gap-2 transition hover:text-blue-600"
            >
              <Icon name="mail" :size="16" />
              {{ profile.email }}
            </a>
            <a
              v-if="profile.github"
              :href="profile.github"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-2 transition hover:text-blue-600"
            >
              <Icon name="github" :size="16" />
              {{ profile.github }}
            </a>
            <a
              v-if="profile.linkedin"
              :href="profile.linkedin"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-2 transition hover:text-blue-600"
            >
              <Icon name="linkedin" :size="16" />
              LinkedIn
            </a>
          </div>
          <!-- 提示：邮箱等联系方式请在 src/data/content.js 的 profile 中修改 -->
        </div>
      </div>
    </section>
  </div>
</template>
