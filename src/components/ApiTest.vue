<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 m-4">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">API Connection Test</h3>
    
    <div class="space-y-4">
      <!-- Connection Status -->
      <div class="flex items-center space-x-2">
        <div 
          :class="connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'"
          class="w-3 h-3 rounded-full"
        ></div>
        <span class="text-sm">
          {{ connectionStatus === 'connected' ? 'Backend Connected' : 
             connectionStatus === 'error' ? 'Backend Error' : 'Testing...' }}
        </span>
      </div>

      <!-- Test Button -->
      <button
        @click="testConnection"
        :disabled="loading"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ loading ? 'Testing...' : 'Test API Connection' }}
      </button>

      <!-- Results -->
      <div v-if="testResult" class="mt-4">
        <h4 class="font-medium mb-2">Test Results:</h4>
        <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto">{{ testResult }}</pre>
      </div>

      <!-- Login Test -->
      <div class="border-t pt-4">
        <h4 class="font-medium mb-2">Quick Login Test:</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <button
            @click="quickLogin('admin@campinghub.com', 'admin123')"
            class="bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600"
          >
            Login as Admin
          </button>
          <button
            @click="quickLogin('john.owner@campinghub.com', 'password123')"
            class="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
          >
            Login as Owner
          </button>
          <button
            @click="quickLogin('user1@campinghub.com', 'password123')"
            class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
          >
            Login as User
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const authStore = useAuthStore()
const loading = ref(false)
const connectionStatus = ref('testing')
const testResult = ref('')

const testConnection = async () => {
  loading.value = true
  testResult.value = ''
  
  try {
    const response = await api.testConnection()
    connectionStatus.value = 'connected'
    testResult.value = JSON.stringify(response.data, null, 2)
  } catch (error) {
    connectionStatus.value = 'error'
    testResult.value = `Error: ${error.message}\n\nDetails: ${JSON.stringify(error.response?.data || {}, null, 2)}`
  } finally {
    loading.value = false
  }
}

const quickLogin = async (email, password) => {
  try {
    const result = await authStore.login({ email, password })
    if (result.success) {
      testResult.value = `✅ Login successful!\nUser: ${authStore.user.firstName} ${authStore.user.lastName}\nRole: ${authStore.user.role}`
    } else {
      testResult.value = `❌ Login failed: ${result.error}`
    }
  } catch (error) {
    testResult.value = `❌ Login error: ${error.message}`
  }
}

onMounted(() => {
  testConnection()
})
</script>