<script setup>
import PageHeader from '../components/PageHeader.vue'
import Icon from '../components/Icon.vue'
import { skills } from '../data/content'
</script>

<template>
  <div>
    <PageHeader
      kicker="Skills"
      title="技能栈"
      description="编程语言、工具框架与业务能力的组合，聚焦数据开发与 AI 应用方向。熟练度以项目实践为参考，可随经历更新。"
    />

    <section class="bg-slate-50 py-12 sm:py-16">
      <div class="mx-auto max-w-5xl space-y-8 px-4 sm:px-6">
        <!-- 编程语言 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="code" :size="22" class="text-blue-600" />
            编程语言
          </h3>
          <div class="mt-6 space-y-6">
            <div v-for="l in skills.languages" :key="l.name">
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

        <!-- 工具与框架 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="database" :size="22" class="text-blue-600" />
            工具与框架
          </h3>
          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="t in skills.tools"
              :key="t"
              class="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
            >
              {{ t }}
            </span>
          </div>
        </div>

        <!-- 业务能力 -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h3 class="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon name="sparkles" :size="22" class="text-blue-600" />
            业务能力
          </h3>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div
              v-for="b in skills.business"
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
