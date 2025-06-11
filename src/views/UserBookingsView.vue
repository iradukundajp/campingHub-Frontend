<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p class="text-gray-600 mt-2">View and manage your camping reservations</p>
      </div>

      <!-- Filter Tabs -->
      <div class="mb-6">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="activeTab === tab.key ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
          >
            {{ tab.label }}
            <span 
              v-if="getBookingCount(tab.key) > 0"
              class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs"
            >
              {{ getBookingCount(tab.key) }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div v-for="n in 3" :key="n" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div class="flex items-center space-x-4">
            <div class="w-24 h-24 bg-gray-300 rounded-lg"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-300 rounded w-3/4"></div>
              <div class="h-4 bg-gray-300 rounded w-1/2"></div>
              <div class="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Error loading bookings</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="fetchBookings"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Bookings List -->
      <div v-else-if="filteredBookings.length > 0" class="space-y-4">
        <div 
          v-for="booking in filteredBookings" 
          :key="booking.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start space-x-4">
              <!-- Spot Image -->
              <div class="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  :src="getSpotImage(booking.spot)"
                  :alt="booking.spot.title"
                  class="w-full h-full object-cover"
                >
              </div>

              <!-- Booking Details -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">
                      {{ booking.spot.title }}
                    </h3>
                    <p class="text-gray-600 text-sm mb-2">{{ booking.spot.location }}</p>
                    
                    <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                        </svg>
                        {{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}
                      </div>
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                        </svg>
                        {{ booking.guests }} {{ booking.guests === 1 ? 'guest' : 'guests' }}
                      </div>
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M12 2a1 1 0 00-2 0v1H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-5V2zm1 4a1 1 0 10-2 0v3a1 1 0 001 1h3a1 1 0 100-2h-2V6z"/>
                        </svg>
                        {{ booking.nights }} {{ booking.nights === 1 ? 'night' : 'nights' }}
                      </div>
                    </div>

                    <!-- Notes -->
                    <p v-if="booking.notes" class="text-sm text-gray-700 italic mb-3">
                      "{{ booking.notes }}"
                    </p>
                  </div>

                  <!-- Status & Price -->
                  <div class="text-right">
                    <div class="mb-2">
                      <span 
                        :class="getStatusClasses(booking.status)"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ formatStatus(booking.status) }}
                      </span>
                    </div>
                    <div class="text-lg font-semibold text-gray-900">
                      €{{ parseFloat(booking.totalPrice).toFixed(2) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      €{{ (booking.totalPrice / booking.nights).toFixed(2) }} / night
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="mt-4 flex items-center justify-between">
                  <div class="flex space-x-3">
                    <router-link 
                      :to="`/spots/${booking.spot.id}`"
                      class="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                    >
                      View Spot
                    </router-link>
                    
                    <button 
                      v-if="canCancel(booking)"
                      @click="openCancelModal(booking)"
                      class="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Cancel Booking
                    </button>
                    
                    <button 
                      v-if="canReview(booking)"
                      @click="openReviewModal(booking)"
                      class="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                    >
                      Write Review
                    </button>
                    
                    <router-link 
                      :to="`/spots/${booking.spot.id}`"
                      v-if="canRebook(booking)"
                      class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      Book Again
                    </router-link>
                  </div>

                  <div class="text-xs text-gray-500">
                    Booked {{ formatDate(booking.createdAt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ activeTab === 'all' ? 'No bookings yet' : `No ${activeTab} bookings` }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ activeTab === 'all' ? 'Start exploring and book your first camping adventure!' : `You have no ${activeTab} bookings at the moment.` }}
        </p>
        <router-link 
          to="/spots"
          class="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors inline-block"
        >
          Browse Camping Spots
        </router-link>
      </div>
    </div>

    <!-- Cancel Modal -->
    <div 
      v-if="showCancelModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeCancelModal"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6" @click.stop>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Cancel Booking</h3>
        <p class="text-gray-600 mb-4">
          Are you sure you want to cancel your booking for {{ selectedBooking?.spot?.title }}?
        </p>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Reason for cancellation (optional)
          </label>
          <textarea
            v-model="cancelReason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            placeholder="Tell us why you're canceling..."
          ></textarea>
        </div>

        <div class="flex space-x-3">
          <button
            @click="closeCancelModal"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Keep Booking
          </button>
          <button
            @click="confirmCancel"
            :disabled="cancelLoading"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {{ cancelLoading ? 'Canceling...' : 'Cancel Booking' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const loading = ref(true)
const error = ref('')
const bookings = ref([])
const activeTab = ref('all')

const showCancelModal = ref(false)
const selectedBooking = ref(null)
const cancelReason = ref('')
const cancelLoading = ref(false)

const tabs = [
  { key: 'all', label: 'All Bookings' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' }
]

const filteredBookings = computed(() => {
  if (activeTab.value === 'all') {
    return bookings.value
  }
  return bookings.value.filter(booking => 
    booking.status.toLowerCase() === activeTab.value.toLowerCase()
  )
})

const getBookingCount = (status) => {
  if (status === 'all') {
    return bookings.value.length
  }
  return bookings.value.filter(booking => 
    booking.status.toLowerCase() === status.toLowerCase()
  ).length
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
    case 'CHECKED_IN':
      return 'bg-purple-100 text-purple-800'
    case 'CHECKED_OUT':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatStatus = (status) => {
  switch (status.toUpperCase()) {
    case 'CONFIRMED': return 'Confirmed'
    case 'PENDING': return 'Pending'
    case 'COMPLETED': return 'Completed'
    case 'CANCELLED': return 'Cancelled'
    case 'CHECKED_IN': return 'Checked In'
    case 'CHECKED_OUT': return 'Checked Out'
    default: return status
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getSpotImage = (spot) => {
  if (spot.images && spot.images.length > 0) {
    return spot.images[0]
  }
  return 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=200'
}

const canCancel = (booking) => {
  const now = new Date()
  const checkIn = new Date(booking.checkIn)
  const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60)
  
  return booking.status === 'CONFIRMED' && hoursUntilCheckIn >= 24
}

const canReview = (booking) => {
  return booking.status === 'COMPLETED' || booking.status === 'CHECKED_OUT'
}

const canRebook = (booking) => {
  return booking.status === 'COMPLETED' || booking.status === 'CANCELLED'
}

const openCancelModal = (booking) => {
  selectedBooking.value = booking
  showCancelModal.value = true
  cancelReason.value = ''
}

const closeCancelModal = () => {
  showCancelModal.value = false
  selectedBooking.value = null
  cancelReason.value = ''
}

const confirmCancel = async () => {
  if (!selectedBooking.value) return
  
  cancelLoading.value = true
  
  try {
    await api.cancelBooking(selectedBooking.value.id, cancelReason.value.trim() || null)
    
    // Update booking status locally
    const bookingIndex = bookings.value.findIndex(b => b.id === selectedBooking.value.id)
    if (bookingIndex !== -1) {
      bookings.value[bookingIndex].status = 'CANCELLED'
    }
    
    closeCancelModal()
  } catch (err) {
    console.error('Error cancelling booking:', err)
    error.value = err.response?.data?.message || 'Failed to cancel booking'
  } finally {
    cancelLoading.value = false
  }
}

const openReviewModal = (booking) => {
  // TODO: Implement review modal
  console.log('Open review modal for booking:', booking.id)
  alert('Review functionality coming soon!')
}

const fetchBookings = async () => {
  try {
    loading.value = true
    error.value = ''
    
    console.log('Fetching user bookings...')
    const response = await api.getUserBookings()
    console.log('Bookings response:', response.data)
    
    // Calculate nights for each booking
    bookings.value = (response.data.bookings || []).map(booking => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      
      return {
        ...booking,
        nights
      }
    })
    
  } catch (err) {
    console.error('Error fetching bookings:', err)
    error.value = err.response?.data?.message || 'Failed to load bookings'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBookings()
})
</script>