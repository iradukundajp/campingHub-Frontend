<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
        <p class="text-gray-600 mt-2">Manage your account settings and personal information</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="text-center">
              <!-- Avatar -->
              <div class="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-white">
                  {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
                </span>
              </div>
              
              <h2 class="text-xl font-semibold text-gray-900">
                {{ user?.firstName }} {{ user?.lastName }}
              </h2>
              <p class="text-gray-600">{{ user?.email }}</p>
              
              <!-- Role Badge -->
              <div class="mt-4">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="roleClasses"
                >
                  {{ user?.role }}
                </span>
              </div>

              <!-- Stats -->
              <div class="mt-6 grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-gray-900">{{ stats.bookings }}</div>
                  <div class="text-sm text-gray-600">Bookings</div>
                </div>
                <div v-if="user?.role === 'OWNER'">
                  <div class="text-2xl font-bold text-gray-900">{{ stats.spots }}</div>
                  <div class="text-sm text-gray-600">Spots</div>
                </div>
                <div v-else>
                  <div class="text-2xl font-bold text-gray-900">{{ stats.reviews || 0 }}</div>
                  <div class="text-sm text-gray-600">Reviews</div>
                </div>
              </div>

              <!-- Join Date -->
              <div class="mt-6 text-sm text-gray-500">
                Member since {{ formatDate(user?.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>

            <!-- Success Message -->
            <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <p class="text-sm text-green-800">{{ successMessage }}</p>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- First Name -->
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                </div>

                <!-- Last Name -->
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                </div>
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
              </div>

              <!-- Phone (Optional) -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="+32 123 456 789"
                >
              </div>

              <!-- Save Button -->
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="loading || !hasChanges"
                  class="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span v-if="loading" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                  <span v-else>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Quick Actions -->
          <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <router-link 
                to="/bookings"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">My Bookings</h4>
                  <p class="text-sm text-gray-600">View and manage your reservations</p>
                </div>
              </router-link>

              <router-link 
                v-if="user?.role === 'OWNER'"
                to="/owner"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Manage Spots</h4>
                  <p class="text-sm text-gray-600">Add and edit your camping spots</p>
                </div>
              </router-link>

              <router-link 
                v-else
                to="/spots"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">Browse Spots</h4>
                  <p class="text-sm text-gray-600">Find your next camping adventure</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const user = ref(null)
const stats = ref({
  bookings: 0,
  spots: 0,
  reviews: 0
})

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const originalForm = ref({})

const roleClasses = computed(() => {
  const role = user.value?.role
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-800'
    case 'OWNER':
      return 'bg-blue-100 text-blue-800'
    case 'USER':
    default:
      return 'bg-green-100 text-green-800'
  }
})

const hasChanges = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}

const fetchProfile = async () => {
  try {
    const response = await api.getProfile()
    user.value = response.data.user
    
    // Update form with user data
    form.value = {
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
      email: user.value.email || '',
      phone: user.value.phone || ''
    }
    
    // Store original form data
    originalForm.value = { ...form.value }
    
    // Update stats
    stats.value = {
      bookings: user.value._count?.bookings || 0,
      spots: user.value._count?.ownedSpots || 0,
      reviews: 0 // Add reviews count if available
    }
    
  } catch (err) {
    error.value = 'Failed to load profile'
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const response = await api.updateProfile(form.value)
    
    // Update user in auth store
    authStore.user = response.data.user
    
    // Update local user data
    user.value = response.data.user
    originalForm.value = { ...form.value }
    
    successMessage.value = 'Profile updated successfully!'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update profile'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>