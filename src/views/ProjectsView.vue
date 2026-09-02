<script setup>
import PageHeader from '../components/PageHeader.vue'
import ProjectCard from '../components/ProjectCard.vue'
import { projects } from '../data/content'
</script>

<template>
  <div>
    <PageHeader
      kicker="Portfolio"
      title="项目作品集"
      description="从财务 BI 缺陷修复到金蝶云 API 对接，再到 RAG 简历问答 Agent 与银行数据科技备赛，展示我在数据分析、ERP 对接与 AI 应用上的完整实践。"
    />

    <section class="bg-slate-50 py-12 sm:py-16">
      <div class="mx-auto max-w-4xl space-y-8 px-4 sm:px-6">
        <!-- 每个项目卡片均含：简介 / 技术栈 / 截图占位 / 关键成果 / 代码片段 -->
        <ProjectCard v-for="p in projects" :key="p.id" :project="p" />
      </div>
    </section>
  </div>
</template>
