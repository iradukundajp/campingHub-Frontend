<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Authentication Check -->
    <div v-if="!authStore.isAuthenticated" class="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p class="text-blue-800 text-sm mb-3">Sign in to book this camping spot</p>
      <router-link 
        to="/login" 
        class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        Sign In
      </router-link>
    </div>

    <!-- Booking Form -->
    <div v-else class="space-y-4">
      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
        <p class="text-red-800 text-sm">{{ error }}</p>
      </div>

      <!-- Check-in Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
        <input
          v-model="form.checkIn"
          type="date"
          :min="minDate"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          @change="validateDates"
        >
      </div>

      <!-- Check-out Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
        <input
          v-model="form.checkOut"
          type="date"
          :min="form.checkIn || minDate"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          @change="validateDates"
        >
      </div>

      <!-- Number of Guests -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Guests</label>
        <select
          v-model="form.guests"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Select guests</option>
          <option 
            v-for="num in Math.min(spot.capacity, 20)" 
            :key="num" 
            :value="num"
          >
            {{ num }} {{ num === 1 ? 'guest' : 'guests' }}
          </option>
        </select>
      </div>

      <!-- Special Requests -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Special requests (optional)</label>
        <textarea
          v-model="form.notes"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          placeholder="Any special requests or notes..."
        ></textarea>
      </div>

      <!-- Booking Summary -->
      <div v-if="isFormValid" class="border-t border-gray-200 pt-4">
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">${{ parseFloat(spot.price).toFixed(2) }} × {{ totalNights }} nights</span>
            <span class="text-gray-900">${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Service fee</span>
            <span class="text-gray-900">${{ serviceFee.toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-200 pt-2 flex justify-between font-semibold">
            <span class="text-gray-900">Total</span>
            <span class="text-gray-900">${{ totalPrice.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Availability Check -->
      <div v-if="availabilityMessage" class="p-3 rounded-lg" :class="availabilityClass">
        <p class="text-sm">{{ availabilityMessage }}</p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="!canBook || loading"
        class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
        <span v-else>{{ isInstantBook ? 'Book Instantly' : 'Request to Book' }}</span>
      </button>

      <!-- Additional Info -->
      <div class="text-xs text-gray-500 space-y-1">
        <p>{{ isInstantBook ? 'You will be charged immediately' : 'You won\'t be charged yet' }}</p>
        <p>Free cancellation up to 24 hours before check-in</p>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const props = defineProps({
  spot: {
    type: Object,
    required: true
  },
  unavailableDates: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['booking-success'])

const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const availabilityMessage = ref('')

const form = ref({
  checkIn: '',
  checkOut: '',
  guests: '',
  notes: ''
})

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const isFormValid = computed(() => {
  return form.value.checkIn && 
         form.value.checkOut && 
         form.value.guests &&
         new Date(form.value.checkOut) > new Date(form.value.checkIn)
})

const totalNights = computed(() => {
  if (!form.value.checkIn || !form.value.checkOut) return 0
  const checkIn = new Date(form.value.checkIn)
  const checkOut = new Date(form.value.checkOut)
  return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
})

const subtotal = computed(() => {
  return totalNights.value * parseFloat(props.spot.price)
})

const serviceFee = computed(() => {
  return subtotal.value * 0.05 // 5% service fee
})

const totalPrice = computed(() => {
  return subtotal.value + serviceFee.value
})

const isInstantBook = computed(() => {
  return props.spot.isInstantBook
})

const availabilityClass = computed(() => {
  if (availabilityMessage.value.includes('available')) {
    return 'bg-green-50 border border-green-200 text-green-800'
  } else if (availabilityMessage.value.includes('not available')) {
    return 'bg-red-50 border border-red-200 text-red-800'
  }
  return 'bg-blue-50 border border-blue-200 text-blue-800'
})

const canBook = computed(() => {
  return isFormValid.value && 
         !loading.value && 
         availabilityMessage.value.includes('available')
})

const validateDates = async () => {
  if (!isFormValid.value) {
    availabilityMessage.value = ''
    return
  }

  // Check if dates conflict with unavailable dates
  const checkIn = new Date(form.value.checkIn)
  const checkOut = new Date(form.value.checkOut)

  const hasConflict = props.unavailableDates.some(period => {
    const periodStart = new Date(period.start)
    const periodEnd = new Date(period.end)
    
    return (checkIn < periodEnd && checkOut > periodStart)
  })

  if (hasConflict) {
    availabilityMessage.value = 'These dates are not available. Please choose different dates.'
    return
  }

  // Check with API for real-time availability
  try {
    await api.getSpotAvailability(props.spot.id, {
      startDate: form.value.checkIn,
      endDate: form.value.checkOut
    })
    
    availabilityMessage.value = `Available for ${totalNights.value} ${totalNights.value === 1 ? 'night' : 'nights'}`
  } catch (err) {
    availabilityMessage.value = 'These dates are not available. Please choose different dates.'
  }
}

const handleSubmit = async () => {
  if (!canBook.value) return

  loading.value = true
  error.value = ''

  try {
    const bookingData = {
      spotId: props.spot.id,
      checkIn: form.value.checkIn,
      checkOut: form.value.checkOut,
      guests: parseInt(form.value.guests),
      notes: form.value.notes?.trim() || null
    }

    await api.createBooking(bookingData)
    
    // Emit success event
    emit('booking-success')
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create booking. Please try again.'
  } finally {
    loading.value = false
  }
}

// Watch for form changes to validate dates
watch([() => form.value.checkIn, () => form.value.checkOut], () => {
  if (form.value.checkIn && form.value.checkOut) {
    validateDates()
  } else {
    availabilityMessage.value = ''
  }
}, { deep: true })
</script>