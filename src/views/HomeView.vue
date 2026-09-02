<script setup>
import Icon from '../components/Icon.vue'
import SectionHeader from '../components/SectionHeader.vue'
import { profile, jobIntent, projects, skills } from '../data/content'
</script>

<template>
  <div>
    <!-- ============ Hero 区域 ============ -->
    <section class="relative overflow-hidden bg-slate-950 text-white">
      <!-- 技术网格纹理 + 光晕 -->
      <div class="tech-grid-bg absolute inset-0"></div>
      <div class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl"></div>

      <div class="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <!-- 求职地区 -->
        <p
          class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-300"
        >
          <Icon name="map-pin" :size="14" />
          求职地区：{{ profile.location }}
        </p>

        <h1 class="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {{ profile.name }}
        </h1>
        <p class="mt-4 text-lg font-medium text-blue-400 sm:text-xl">{{ profile.name }} · {{ profile.role.split(' · ')[0] }}</p>
        <p class="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
          {{ profile.intro }}
        </p>

        <!-- 求职意向 -->
        <div class="mt-8">
          <p class="text-sm font-semibold text-slate-400">求职意向</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="j in jobIntent"
              :key="j"
              class="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-300"
            >
              {{ j }}
            </span>
          </div>
        </div>

        <!-- 按钮组 -->
        <!-- 简历PDF：将你的简历重命名为 resume.pdf 放到 public/resume/ 即可自动生效 -->
        <div class="mt-9 flex flex-wrap gap-3">
          <a
            :href="profile.resumeUrl"
            download
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Icon name="download" :size="18" />
            下载简历 PDF
          </a>
          <router-link
            to="/projects"
            class="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            查看项目
            <Icon name="arrow-right" :size="18" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- ============ 项目精选 ============ -->
    <section class="bg-white py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="项目精选"
          subtitle="从 BI 缺陷修复到 RAG 简历 Agent，4 个代表性项目，展示数据开发与 AI 应用实践。"
        />
        <div class="mt-10 grid gap-6 sm:grid-cols-2">
          <router-link
            v-for="p in projects"
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
              查看详情
              <Icon name="arrow-right" :size="16" />
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ============ 技能速览 ============ -->
    <section class="bg-slate-50 py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader title="技能速览" subtitle="编程语言、工具框架与业务能力的三维能力结构。" />
        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <div
            v-for="g in skills.groups"
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
            查看完整技能栈
            <Icon name="arrow-right" :size="16" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- ============ 联系 CTA ============ -->
    <section class="bg-slate-950 py-16">
      <div class="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          期待与您进一步沟通
        </h2>
        <p class="mt-3 text-slate-400">{{ profile.tagline }}。欢迎通过邮箱联系我。</p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <a
            :href="`mailto:${profile.email}`"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Icon name="mail" :size="18" />
            {{ profile.email }}
          </a>
          <a
            :href="profile.resumeUrl"
            download
            class="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Icon name="file-text" :size="18" />
            下载简历
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
