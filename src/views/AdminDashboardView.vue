<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 flex items-center">
          <svg class="w-8 h-8 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/>
          </svg>
          Admin Dashboard
        </h1>
        <p class="text-gray-600 mt-2">System administration and management</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <span class="ml-3 text-gray-600">Loading dashboard data...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <div>
            <h3 class="text-red-800 font-medium">Error loading dashboard</h3>
            <p class="text-red-600 text-sm mt-1">{{ error }}</p>
            <button @click="loadAdminStats" class="mt-2 text-red-800 hover:text-red-900 font-medium text-sm">
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Users Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM9 7a1 1 0 000-2 1 1 0 000 2zM7 16.75A6.98 6.98 0 0015 11v-1a2 2 0 00-2-2H7a2 2 0 00-2 2v1a6.98 6.98 0 008 5.75z"/>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ stats.totalUsers }}</h3>
                <p class="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex items-center text-sm text-green-600">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                {{ stats.regularUsers }} regular users
              </div>
            </div>
          </div>

          <!-- Total Spots Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ stats.totalSpots }}</h3>
                <p class="text-sm text-gray-600">Camping Spots</p>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex items-center text-sm text-orange-600">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                {{ stats.inactiveSpots }} inactive
              </div>
            </div>
          </div>

          <!-- Total Bookings Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ stats.totalBookings }}</h3>
                <p class="text-sm text-gray-600">Total Bookings</p>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex items-center text-sm text-blue-600">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
                {{ stats.pendingBookings }} pending
              </div>
            </div>
          </div>

          <!-- Total Revenue Card -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.563-.649-1.413-1.076-2.353-1.253V5z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">€{{ stats.totalRevenue.toFixed(2) }}</h3>
                <p class="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex items-center text-sm text-green-600">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                {{ stats.paidPayments }} paid payments
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="mb-6">
          <nav class="flex space-x-8 border-b border-gray-200">
            <button
              v-for="tab in adminTabs"
              :key="tab.key"
              @click="setActiveTab(tab.key)"
              :class="activeTab === tab.key 
                ? 'border-purple-500 text-purple-600 bg-purple-50' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg"
            >
              <div class="flex items-center space-x-2">
                <span>{{ tab.label }}</span>
                <span v-if="tab.key === 'bookings' && stats.pendingBookings > 0" 
                      class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {{ stats.pendingBookings }}
                </span>
              </div>
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <!-- Users Management -->
          <div v-if="activeTab === 'users'" class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900">User Management</h3>
              <button @click="refreshData" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" clip-rule="evenodd"/>
                </svg>
                <span>Refresh</span>
              </button>
            </div>
            
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-2">User Overview</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ stats.adminUsers }}</div>
                    <div class="text-sm text-gray-600">Administrators</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">{{ stats.ownerUsers }}</div>
                    <div class="text-sm text-gray-600">Spot Owners</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gray-600">{{ stats.regularUsers }}</div>
                    <div class="text-sm text-gray-600">Regular Users</div>
                  </div>
                </div>
              </div>

              <!-- Recent Users Table -->
              <div v-if="recentUsers.length > 0">
                <h4 class="font-medium text-gray-900 mb-3">Recent Users</h4>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="user in recentUsers" :key="user.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                            <div class="text-sm text-gray-500">{{ user.email }}</div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="{
                            'bg-red-100 text-red-800': user.role === 'ADMIN',
                            'bg-blue-100 text-blue-800': user.role === 'OWNER',
                            'bg-gray-100 text-gray-800': user.role === 'USER'
                          }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                            {{ user.role }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="{
                            'bg-green-100 text-green-800': user.isActive,
                            'bg-red-100 text-red-800': !user.isActive
                          }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                            {{ user.isActive ? 'Active' : 'Inactive' }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(user.createdAt) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ user._count?.bookings || 0 }} bookings, {{ user._count?.ownedSpots || 0 }} spots
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div v-else class="text-center py-12">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <h4 class="text-lg font-medium text-gray-900 mb-2">User Management Interface</h4>
                <p class="text-gray-600 mb-4">Comprehensive user management tools</p>
              </div>
            </div>
          </div>

          <!-- Other tabs content can be added here in the same pattern -->
          <div v-else-if="activeTab === 'spots'" class="p-6">
            <div class="text-center py-12">
              <h4 class="text-lg font-medium text-gray-900 mb-2">Spot Management</h4>
              <p class="text-gray-600">Coming soon...</p>
            </div>
          </div>

          <div v-else-if="activeTab === 'bookings'" class="p-6">
            <div class="text-center py-12">
              <h4 class="text-lg font-medium text-gray-900 mb-2">Booking Management</h4>
              <p class="text-gray-600">Coming soon...</p>
            </div>
          </div>

          <div v-else-if="activeTab === 'analytics'" class="p-6">
            <div class="text-center py-12">
              <h4 class="text-lg font-medium text-gray-900 mb-2">Analytics</h4>
              <p class="text-gray-600">Coming soon...</p>
            </div>
          </div>

          <div v-else-if="activeTab === 'system'" class="p-6">
            <div class="text-center py-12">
              <h4 class="text-lg font-medium text-gray-900 mb-2">System Settings</h4>
              <p class="text-gray-600">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const authStore = useAuthStore()
const router = useRouter()

// Redirect if not admin
if (!authStore.isAuthenticated || authStore.user?.role !== 'ADMIN') {
  router.push('/')
}

// Reactive data
const loading = ref(true)
const error = ref(null)
const activeTab = ref('users')

// Real stats data from API
const stats = ref({
  totalUsers: 0,
  regularUsers: 0,
  ownerUsers: 0,
  adminUsers: 0,
  totalSpots: 0,
  activeSpots: 0,
  inactiveSpots: 0,
  totalBookings: 0,
  pendingBookings: 0,
  confirmedBookings: 0,
  totalRevenue: 0,
  paidPayments: 0
})

// Recent activity data
const recentUsers = ref([])
const recentSpots = ref([])
const recentBookings = ref([])

const adminTabs = [
  { key: 'users', label: 'Users' },
  { key: 'spots', label: 'Spots' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'system', label: 'System' }
]

// Load admin statistics from real API
const loadAdminStats = async () => {
  try {
    loading.value = true
    error.value = null
    
    console.log('🔄 Loading admin dashboard data...')
    
    const response = await api.getAdminDashboard()
    
    if (response.data && response.data.dashboard) {
      const dashboardData = response.data.dashboard
      
      // Update stats with real data
      stats.value = {
        totalUsers: dashboardData.overview.users.total,
        regularUsers: dashboardData.overview.users.regular,
        ownerUsers: dashboardData.overview.users.owners,
        adminUsers: dashboardData.overview.users.admins,
        totalSpots: dashboardData.overview.spots.total,
        activeSpots: dashboardData.overview.spots.active,
        inactiveSpots: dashboardData.overview.spots.inactive,
        totalBookings: dashboardData.overview.bookings.total,
        pendingBookings: dashboardData.overview.bookings.pending,
        confirmedBookings: dashboardData.overview.bookings.confirmed,
        totalRevenue: dashboardData.overview.revenue.total,
        paidPayments: dashboardData.overview.revenue.paidPayments
      }
      
      // Update recent activity
      recentUsers.value = dashboardData.recentActivity.recentUsers || []
      recentSpots.value = dashboardData.recentActivity.recentSpots || []
      recentBookings.value = dashboardData.recentActivity.recentBookings || []
      
      console.log('✅ Dashboard data loaded successfully:', stats.value)
    } else {
      throw new Error('Invalid dashboard data format')
    }
    
  } catch (err) {
    console.error('❌ Error loading dashboard:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load dashboard data'
  } finally {
    loading.value = false
  }
}

// Refresh data function
const refreshData = async () => {
  await loadAdminStats()
}

// Set active tab
const setActiveTab = (tabKey) => {
  activeTab.value = tabKey
}

// Format date helper
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Load data on component mount
onMounted(() => {
  loadAdminStats()
})
</script>

<style scoped>
/* Custom styles for admin dashboard */
.admin-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200;
}
</style>