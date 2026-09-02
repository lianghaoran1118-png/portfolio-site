<script setup>
import PageHeader from '../components/PageHeader.vue'
import ProjectCard from '../components/ProjectCard.vue'
import { useContent, ui } from '../i18n'

const c = useContent()
</script>

<template>
  <div>
    <PageHeader
      kicker="Portfolio"
      :title="ui.projectsTitle"
      :description="ui.projectsDesc"
    />

    <section class="bg-slate-50 py-12 sm:py-16">
      <div class="mx-auto max-w-4xl space-y-8 px-4 sm:px-6">
        <ProjectCard v-for="p in c.projects" :key="p.id" :project="p" />
      </div>
    </section>
  </div>
</template>
