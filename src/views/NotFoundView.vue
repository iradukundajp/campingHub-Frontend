<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <div class="relative">
          <!-- Tent Illustration -->
          <svg class="w-32 h-32 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11"/>
          </svg>
          
          <!-- 404 Text -->
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-6xl font-bold text-gray-300">404</span>
          </div>
        </div>
      </div>

      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Oops! Looks like you're lost in the wilderness
        </h1>
        <p class="text-gray-600 mb-8">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
      </div>

      <!-- Quick Links -->
      <div class="space-y-4">
        <div class="space-y-3">
          <router-link 
            to="/"
            class="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-block"
          >
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Back to Home
          </router-link>
          
          <router-link 
            to="/spots"
            class="w-full border-2 border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors inline-block"
          >
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Browse Camping Spots
          </router-link>
        </div>

        <!-- Help Links -->
        <div class="pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-500 mb-4">Need help finding what you're looking for?</p>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <router-link to="/" class="text-primary hover:text-primary-dark transition-colors">
              Popular Destinations
            </router-link>
            <router-link to="/spots" class="text-primary hover:text-primary-dark transition-colors">
              All Camping Spots
            </router-link>
            <button class="text-primary hover:text-primary-dark transition-colors">
              Contact Support
            </button>
            <button class="text-primary hover:text-primary-dark transition-colors">
              Help Center
            </button>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="pt-6">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for camping spots..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            @keyup.enter="performSearch"
          >
          <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <!-- Fun Camping Tips -->
      <div class="pt-8 text-left">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">💡 While you're here, here's a camping tip:</h3>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-blue-800 text-sm">
            {{ randomTip }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const campingTips = [
  "Always inform someone about your camping plans and expected return time for safety.",
  "Pack layers of clothing as temperatures can drop significantly at night, even in summer.",
  "Bring a first aid kit and know basic wilderness first aid techniques.",
  "Store food in bear-proof containers or hang it high between trees to avoid wildlife encounters.",
  "Check weather forecasts and have a plan for severe weather conditions.",
  "Practice setting up your tent at home before your trip to avoid surprises in the dark.",
  "Bring extra batteries for flashlights and consider solar chargers for longer trips.",
  "Leave no trace - pack out all trash and respect the natural environment."
]

const randomTip = computed(() => {
  return campingTips[Math.floor(Math.random() * campingTips.length)]
})

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'CampingSpots',
      query: { search: searchQuery.value.trim() }
    })
  }
}
</script>