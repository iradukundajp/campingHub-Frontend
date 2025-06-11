<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Global Header for all pages except home -->
    <Header v-if="!isHomePage" />
    
    <!-- Main content -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/layout/AppHeader.vue'

const route = useRoute()

const isHomePage = computed(() => {
  return route.name === 'Home'
})
</script>

<style>
/* Global styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
}
</style>