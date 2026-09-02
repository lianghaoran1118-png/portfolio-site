<script setup>
import AppNav from './components/AppNav.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <AppNav />
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>
