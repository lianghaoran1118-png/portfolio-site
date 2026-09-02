<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  align: { type: String, default: 'left' }, // 'left' | 'center'
})
</script>

<template>
  <div :class="align === 'center' ? 'text-center' : ''">
    <h2 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      class="mt-3 max-w-2xl text-base leading-relaxed text-slate-600"
      :class="align === 'center' ? 'mx-auto' : ''"
    >
      {{ subtitle }}
    </p>
  </div>
</template>
