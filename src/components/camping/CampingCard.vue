<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
    <!-- Image Section -->
    <div class="relative aspect-[4/3] overflow-hidden">
      <img 
        :src="primaryImage" 
        :alt="spot.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        @error="handleImageError"
      >
      
      <!-- Heart/Favorite Button -->
      <button 
        class="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        @click.prevent="toggleFavorite"
      >
        <svg 
          class="w-4 h-4 transition-colors"
          :class="isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      <!-- Image Indicators -->
      <div v-if="spot.images && spot.images.length > 1" class="absolute bottom-3 left-1/2 transform -translate-x-1/2">
        <div class="flex space-x-1">
          <div 
            v-for="(_, index) in spot.images" 
            :key="index"
            class="w-2 h-2 rounded-full"
            :class="index === 0 ? 'bg-white' : 'bg-white/60'"
          ></div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-4">
      <!-- Location & Rating -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center text-sm text-gray-600">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
          <span class="truncate">{{ spot.location }}</span>
        </div>
        
        <div v-if="spot.averageRating" class="flex items-center text-sm">
          <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span class="text-gray-900 font-medium">{{ spot.averageRating }}</span>
          <span class="text-gray-500 ml-1">({{ spot.totalReviews || 0 }})</span>
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {{ spot.title }}
      </h3>

      <!-- Capacity -->
      <div class="flex items-center text-sm text-gray-600 mb-3">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
        </svg>
        <span>Up to {{ spot.capacity }} guests</span>
      </div>

      <!-- Amenities Preview -->
      <div v-if="spot.amenities && spot.amenities.length > 0" class="flex flex-wrap gap-1 mb-3">
        <span 
          v-for="amenity in spot.amenities.slice(0, 3)" 
          :key="amenity"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          {{ amenity }}
        </span>
        <span 
          v-if="spot.amenities.length > 3"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          +{{ spot.amenities.length - 3 }} more
        </span>
      </div>

      <!-- Price -->
      <div class="flex items-end justify-between">
        <div class="text-lg">
          <span class="font-bold text-gray-900">${{ formatPrice(spot.price) }}</span>
          <span class="text-gray-600 text-sm"> / night</span>
        </div>
        
        <!-- View Details Button -->
        <router-link 
          :to="`/spots/${spot.id}`"
          class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          View Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  spot: {
    type: Object,
    required: true
  }
})

const isFavorite = ref(false)

const primaryImage = computed(() => {
  if (props.spot.images && props.spot.images.length > 0) {
    return props.spot.images[0]
  }
  return 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&auto=format&fit=crop'
})

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2)
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // TODO: Implement favorite functionality with API
}

const handleImageError = (event) => {
  event.target.src = 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&auto=format&fit=crop'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>