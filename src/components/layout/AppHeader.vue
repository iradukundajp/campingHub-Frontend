<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="text-2xl">🏕️</div>
            <span class="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              CampingHub
            </span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link 
            to="/spots" 
            class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Browse Spots
          </router-link>
          
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
            <router-link 
              to="/bookings" 
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              My Bookings
            </router-link>
            
            <router-link 
              v-if="authStore.isOwner || authStore.isAdmin" 
              to="/owner" 
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Manage Spots
            </router-link>
            
            <router-link 
              v-if="authStore.isAdmin" 
              to="/admin" 
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Admin Panel
            </router-link>
            
            <!-- User Menu -->
            <div class="relative" ref="userMenuRef">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-white">
                    {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
                  </span>
                </div>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
              >
                <router-link 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  @click="showUserMenu = false"
                >
                  Profile
                </router-link>
                <button 
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="flex items-center space-x-4">
            <router-link 
              to="/login" 
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Sign In
            </router-link>
            <router-link 
              to="/register" 
              class="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-colors"
            >
              Sign Up
            </router-link>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="text-gray-600 hover:text-gray-900"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 py-4">
        <div class="space-y-3">
          <router-link 
            to="/spots" 
            class="block text-gray-600 hover:text-gray-900 font-medium"
            @click="showMobileMenu = false"
          >
            Browse Spots
          </router-link>
          
          <div v-if="authStore.isAuthenticated" class="space-y-3">
            <router-link 
              to="/bookings" 
              class="block text-gray-600 hover:text-gray-900 font-medium"
              @click="showMobileMenu = false"
            >
              My Bookings
            </router-link>
            
            <router-link 
              v-if="authStore.isOwner || authStore.isAdmin" 
              to="/owner" 
              class="block text-gray-600 hover:text-gray-900 font-medium"
              @click="showMobileMenu = false"
            >
              Manage Spots
            </router-link>
            
            <router-link 
              v-if="authStore.isAdmin"
              to="/admin" 
              class="block text-gray-600 hover:text-gray-900 font-medium"
              @click="showMobileMenu = false"
            >
              Admin Panel
            </router-link>
            
            <router-link 
              to="/profile" 
              class="block text-gray-600 hover:text-gray-900 font-medium"
              @click="showMobileMenu = false"
            >
              Profile
            </router-link>
            
            <button 
              @click="handleLogout"
              class="block text-left text-gray-600 hover:text-gray-900 font-medium"
            >
              Sign Out
            </button>
          </div>
          
          <div v-else class="space-y-3">
            <router-link 
              to="/login" 
              class="block text-gray-600 hover:text-gray-900 font-medium"
              @click="showMobileMenu = false"
            >
              Sign In
            </router-link>
            <router-link 
              to="/register" 
              class="block bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-colors text-center"
              @click="showMobileMenu = false"
            >
              Sign Up
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const userMenuRef = ref(null)

const handleLogout = () => {
  authStore.logout()
  showUserMenu.value = false
  showMobileMenu.value = false
  router.push('/')
}

const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>