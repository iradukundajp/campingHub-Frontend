<template>
  <div id="app">
    <!-- Development API Test Panel -->
    <div v-if="isDevelopment" class="fixed top-4 right-4 z-50">
      <button
        @click="showApiTest = !showApiTest"
        class="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600"
      >
        {{ showApiTest ? 'Hide' : 'API Test' }}
      </button>
    </div>

    <!-- API Test Component -->
    <div 
      v-if="showApiTest && isDevelopment" 
      class="fixed top-16 right-4 z-40 w-96 max-h-[80vh] overflow-y-auto"
    >
      <ApiTest />
    </div>

    <!-- Main App -->
    <router-view />
    
    <!-- Auth Status (Development) -->
    <div v-if="isDevelopment && authStore.isAuthenticated" class="fixed bottom-4 left-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-xs">
      Logged in as: {{ authStore.user?.firstName }} ({{ authStore.user?.role }})
      <button @click="authStore.logout()" class="ml-2 text-red-600 hover:text-red-800">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ApiTest from '@/components/ApiTest.vue'

const authStore = useAuthStore()
const showApiTest = ref(false)

const isDevelopment = computed(() => {
  return process.env.NODE_ENV === 'development'
})
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>