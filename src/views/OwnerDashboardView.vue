<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
            <p class="text-gray-600 mt-2">Manage your camping spots and bookings</p>
          </div>
          <button
            @click="showAddSpotModal = true"
            class="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span>Add New Spot</span>
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ stats.totalSpots }}</h3>
              <p class="text-sm text-gray-600">Total Spots</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ stats.activeSpots }}</h3>
              <p class="text-sm text-gray-600">Active Spots</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 1h6v4H7V6z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ stats.totalBookings }}</h3>
              <p class="text-sm text-gray-600">Total Bookings</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">${{ stats.totalRevenue.toFixed(2) }}</h3>
              <p class="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Content based on active tab -->
      <div v-if="activeTab === 'spots'">
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div class="aspect-[4/3] bg-gray-300 rounded-t-lg"></div>
            <div class="p-4">
              <div class="h-4 bg-gray-300 rounded mb-2"></div>
              <div class="h-6 bg-gray-300 rounded mb-2"></div>
              <div class="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- Spots Grid -->
        <div v-else-if="spots.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="spot in spots" 
            :key="spot.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <!-- Image -->
            <div class="relative aspect-[4/3]">
              <img 
                :src="spot.images?.[0] || 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400'"
                :alt="spot.title"
                class="w-full h-full object-cover"
              >
              <div class="absolute top-3 right-3">
                <span 
                  :class="spot.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ spot.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ spot.title }}</h3>
              <p class="text-gray-600 text-sm mb-2">{{ spot.location }}</p>
              
              <div class="flex items-center justify-between mb-3 text-sm text-gray-600">
                <span>Up to {{ spot.capacity }} guests</span>
                <span>${{ parseFloat(spot.price).toFixed(2) }}/night</span>
              </div>

              <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span>{{ spot.averageRating || 0 }} ({{ spot.totalReviews }})</span>
                </div>
                <span>{{ spot.totalBookings }} bookings</span>
              </div>

              <!-- Actions -->
              <div class="flex space-x-2">
                <button
                  @click="editSpot(spot)"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  @click="toggleSpotStatus(spot)"
                  :class="spot.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  {{ spot.isActive ? 'Deactivate' : 'Activate' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No camping spots yet</h3>
          <p class="text-gray-600 mb-6">Start by adding your first camping spot to attract guests.</p>
          <button
            @click="showAddSpotModal = true"
            class="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Add Your First Spot
          </button>
        </div>
      </div>

      <!-- Bookings Tab -->
      <div v-else-if="activeTab === 'bookings'">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spot</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="booking in bookings" :key="booking.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ booking.user.firstName }} {{ booking.user.lastName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ booking.spot.title }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ booking.guests }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${{ parseFloat(booking.totalPrice).toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="getStatusClasses(booking.status)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ booking.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Spot Modal -->
    <div 
      v-if="showAddSpotModal || showEditSpotModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      @click="closeModals"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full my-8" @click.stop>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">
            {{ editingSpot ? 'Edit Camping Spot' : 'Add New Camping Spot' }}
          </h3>

          <!-- Spot Form -->
          <form @submit.prevent="submitSpot" class="space-y-6">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                v-model="spotForm.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Amazing lakeside camping spot"
              >
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                v-model="spotForm.description"
                rows="4"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder="Describe your camping spot..."
              ></textarea>
            </div>

            <!-- Location & Price -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  v-model="spotForm.location"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="City, Region"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Price per night ($)</label>
                <input
                  v-model.number="spotForm.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="50.00"
                >
              </div>
            </div>

            <!-- Capacity -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Maximum Capacity</label>
              <input
                v-model.number="spotForm.capacity"
                type="number"
                min="1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="6"
              >
            </div>

            <!-- Amenities -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label v-for="amenity in availableAmenities" :key="amenity" class="flex items-center">
                  <input
                    v-model="spotForm.amenities"
                    :value="amenity"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-700">{{ amenity }}</span>
                </label>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="closeModals"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitLoading"
                class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
              >
                {{ submitLoading ? 'Saving...' : (editingSpot ? 'Update Spot' : 'Create Spot') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

// Redirect if not owner
if (authStore.user?.role !== 'OWNER') {
  router.push('/')
}

const loading = ref(true)
const spots = ref([])
const bookings = ref([])
const activeTab = ref('spots')

const showAddSpotModal = ref(false)
const showEditSpotModal = ref(false)
const editingSpot = ref(null)
const submitLoading = ref(false)

const spotForm = ref({
  title: '',
  description: '',
  location: '',
  price: '',
  capacity: '',
  amenities: []
})

const availableAmenities = [
  'WiFi', 'Swimming Pool', 'Restaurant', 'Kids Playground', 
  'Pet Friendly', 'Bike Rental', 'Hiking Trails', 'Campfire Area',
  'Showers', 'Toilets', 'Kitchen', 'Laundry'
]

const tabs = [
  { key: 'spots', label: 'My Spots' },
  { key: 'bookings', label: 'Bookings' }
]

const stats = computed(() => {
  const totalSpots = spots.value.length
  const activeSpots = spots.value.filter(spot => spot.isActive).length
  const totalBookings = bookings.value.length
  const totalRevenue = bookings.value
    .filter(booking => booking.status === 'CONFIRMED')
    .reduce((sum, booking) => sum + parseFloat(booking.totalPrice), 0)

  return {
    totalSpots,
    activeSpots,
    totalBookings,
    totalRevenue
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClasses = (status) => {
  switch (status.toUpperCase()) {
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const fetchSpots = async () => {
  try {
    const response = await api.getOwnerSpots()
    spots.value = response.data.spots
  } catch (error) {
    console.error('Error fetching spots:', error)
  }
}

const fetchBookings = async () => {
  try {
    const response = await api.getOwnerBookings()
    bookings.value = response.data.bookings
  } catch (error) {
    console.error('Error fetching bookings:', error)
  }
}

const editSpot = (spot) => {
  editingSpot.value = spot
  spotForm.value = {
    title: spot.title,
    description: spot.description,
    location: spot.location,
    price: spot.price,
    capacity: spot.capacity,
    amenities: spot.amenities || []
  }
  showEditSpotModal.value = true
}

const toggleSpotStatus = async (spot) => {
  try {
    await api.updateSpot(spot.id, { isActive: !spot.isActive })
    spot.isActive = !spot.isActive
  } catch (error) {
    console.error('Error updating spot status:', error)
  }
}

const submitSpot = async () => {
  submitLoading.value = true

  try {
    if (editingSpot.value) {
      await api.updateSpot(editingSpot.value.id, spotForm.value)
      // Update local spot
      const index = spots.value.findIndex(s => s.id === editingSpot.value.id)
      if (index !== -1) {
        spots.value[index] = { ...spots.value[index], ...spotForm.value }
      }
    } else {
      const response = await api.createSpot(spotForm.value)
      spots.value.unshift(response.data.spot)
    }
    
    closeModals()
  } catch (error) {
    console.error('Error submitting spot:', error)
  } finally {
    submitLoading.value = false
  }
}

const closeModals = () => {
  showAddSpotModal.value = false
  showEditSpotModal.value = false
  editingSpot.value = null
  spotForm.value = {
    title: '',
    description: '',
    location: '',
    price: '',
    capacity: '',
    amenities: []
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchSpots(), fetchBookings()])
  loading.value = false
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>