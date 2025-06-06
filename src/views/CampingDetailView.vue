<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div class="h-96 bg-gray-300 rounded-lg mb-6"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-4">
            <div class="h-6 bg-gray-300 rounded"></div>
            <div class="h-4 bg-gray-300 rounded w-2/3"></div>
            <div class="h-20 bg-gray-300 rounded"></div>
          </div>
          <div class="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div class="max-w-md mx-auto">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Spot not found</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <router-link to="/spots" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          Browse Other Spots
        </router-link>
      </div>
    </div>

    <!-- Spot Details -->
    <div v-else-if="spot" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <ol class="flex items-center space-x-2 text-sm text-gray-500">
          <li><router-link to="/" class="hover:text-gray-700">Home</router-link></li>
          <li><span>/</span></li>
          <li><router-link to="/spots" class="hover:text-gray-700">Camping Spots</router-link></li>
          <li><span>/</span></li>
          <li class="text-gray-900 font-medium">{{ spot.title }}</li>
        </ol>
      </nav>

      <!-- Title and Quick Info -->
      <div class="mb-6">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{{ spot.title }}</h1>
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
            </svg>
            <span>{{ spot.location }}</span>
          </div>
          <div v-if="spot.averageRating" class="flex items-center">
            <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span>{{ spot.averageRating }} ({{ spot.totalReviews }} reviews)</span>
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
            <span>Up to {{ spot.capacity }} guests</span>
          </div>
        </div>
      </div>

      <!-- Image Gallery -->
      <div class="mb-8">
        <div v-if="spot.images && spot.images.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-2 h-96">
          <!-- Main Image -->
          <div class="md:col-span-2 md:row-span-2">
            <img 
              :src="currentImage"
              :alt="spot.title"
              class="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              @click="openImageModal"
            >
          </div>
          <!-- Thumbnail Images -->
          <div v-for="(image, index) in spot.images.slice(1, 5)" :key="index" class="hidden md:block">
            <img 
              :src="image"
              :alt="`${spot.title} - Image ${index + 2}`"
              class="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              @click="setCurrentImage(image)"
            >
          </div>
          <!-- View All Button -->
          <button 
            v-if="spot.images.length > 5"
            @click="openImageModal"
            class="hidden md:flex items-center justify-center bg-black/50 text-white rounded-lg hover:bg-black/60 transition-colors"
          >
            <span class="text-sm font-medium">+{{ spot.images.length - 4 }} more</span>
          </button>
        </div>
        <div v-else class="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          <div class="text-center text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
            </svg>
            <p>No images available</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Description -->
          <div>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">About this spot</h2>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ spot.description }}</p>
          </div>

          <!-- Owner Info -->
          <div class="border-t border-gray-200 pt-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Hosted by {{ spot.owner.firstName }}</h3>
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">
                  {{ spot.owner.firstName.charAt(0) }}{{ spot.owner.lastName.charAt(0) }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ spot.owner.firstName }} {{ spot.owner.lastName }}</p>
                <p class="text-sm text-gray-600">Spot owner</p>
              </div>
            </div>
          </div>

          <!-- Amenities -->
          <div v-if="spot.amenities && spot.amenities.length > 0" class="border-t border-gray-200 pt-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">What this place offers</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="amenity in spot.amenities" 
                :key="amenity"
                class="flex items-center space-x-3"
              >
                <div class="w-6 h-6 text-gray-600">
                  <svg v-if="getAmenityIcon(amenity)" v-html="getAmenityIcon(amenity)" class="w-6 h-6"></svg>
                  <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <span class="text-gray-700">{{ amenity }}</span>
              </div>
            </div>
          </div>

          <!-- Reviews -->
          <div v-if="spot.reviews && spot.reviews.length > 0" class="border-t border-gray-200 pt-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">
              Reviews ({{ spot.reviews.length }})
            </h3>
            
            <div class="space-y-6">
              <div 
                v-for="review in spot.reviews.slice(0, 5)" 
                :key="review.id"
                class="border-b border-gray-100 pb-6 last:border-b-0"
              >
                <div class="flex items-start space-x-4">
                  <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-700">
                      {{ review.user.firstName.charAt(0) }}{{ review.user.lastName.charAt(0) }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <h4 class="font-medium text-gray-900">{{ review.user.firstName }} {{ review.user.lastName }}</h4>
                      <div class="flex items-center">
                        <div class="flex space-x-1">
                          <svg 
                            v-for="star in 5" 
                            :key="star"
                            :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                            class="w-4 h-4" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        </div>
                      </div>
                      <span class="text-sm text-gray-500">{{ formatDate(review.createdAt) }}</span>
                    </div>
                    <p v-if="review.comment" class="text-gray-700">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              v-if="spot.reviews.length > 5"
              class="mt-6 text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Show all {{ spot.reviews.length }} reviews
            </button>
          </div>
        </div>

        <!-- Booking Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
            <div class="mb-6">
              <div class="flex items-baseline space-x-2">
                <span class="text-3xl font-bold text-gray-900">${{ parseFloat(spot.price).toFixed(2) }}</span>
                <span class="text-gray-600">/ night</span>
              </div>
            </div>

            <!-- Booking Form -->
            <BookingForm 
              :spot="spot" 
              :unavailable-dates="spot.unavailableDates || []"
              @booking-success="handleBookingSuccess"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div 
      v-if="showImageModal" 
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      @click="closeImageModal"
    >
      <div class="relative max-w-4xl max-h-full">
        <button 
          @click="closeImageModal"
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <img 
          :src="currentImage" 
          :alt="spot?.title"
          class="max-w-full max-h-full object-contain"
          @click.stop
        >
        <!-- Image Navigation -->
        <div v-if="spot?.images?.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <button
            v-for="(image, index) in spot.images"
            :key="index"
            @click.stop="setCurrentImage(image)"
            :class="image === currentImage ? 'bg-white' : 'bg-white/50'"
            class="w-3 h-3 rounded-full transition-colors"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookingForm from '@/components/booking/BookingForm.vue'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref('')
const spot = ref(null)
const currentImage = ref('')
const showImageModal = ref(false)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getAmenityIcon = (amenity) => {
  const icons = {
    'WiFi': '<path fill="currentColor" d="M2 7a8 8 0 1116 0c0 2.5-5 9-8 9s-8-6.5-8-9z"/>',
    'Swimming Pool': '<path fill="currentColor" d="M2 10h16v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6z"/>',
    'Restaurant': '<path fill="currentColor" d="M8 2a2 2 0 012 2v4a2 2 0 01-2 2H5v6H3V4a2 2 0 012-2h3z"/>',
    'Pet Friendly': '<path fill="currentColor" d="M10 2L3 9l7 7 7-7-7-7z"/>',
    'Bike Rental': '<circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>',
  }
  return icons[amenity] || null
}

const setCurrentImage = (image) => {
  currentImage.value = image
}

const openImageModal = () => {
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
}

const handleBookingSuccess = () => {
  // Handle successful booking
  router.push('/bookings')
}

const fetchSpot = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const spotId = route.params.id
    const response = await api.getSpot(spotId)
    spot.value = response.data.spot
    
    if (spot.value.images && spot.value.images.length > 0) {
      currentImage.value = spot.value.images[0]
    }
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load camping spot'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSpot()
})
</script>