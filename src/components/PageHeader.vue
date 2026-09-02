<script setup>
defineProps({
  kicker: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <section class="border-b border-slate-200 bg-slate-50">
    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <p class="text-sm font-semibold uppercase tracking-widest text-blue-600">{{ kicker }}</p>
      <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {{ title }}
      </h1>
      <p v-if="description" class="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
        {{ description }}
      </p>
    </div>
  </section>
</template>
