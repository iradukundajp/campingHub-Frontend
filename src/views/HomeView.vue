<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=1920&auto=format&fit=crop"
          alt="Camping background"
          class="w-full h-full object-cover opacity-40"
        >
        <div class="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/60"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect 
            <span class="text-primary">Camping Adventure</span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover amazing camping spots around Belgium. From forest retreats to lakeside getaways.
          </p>

          <!-- Search Bar -->
          <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-xl shadow-2xl p-6 text-gray-900">
              <form @submit.prevent="handleSearch" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Location -->
                <div class="md:col-span-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Where</label>
                  <input
                    v-model="searchForm.location"
                    type="text"
                    placeholder="Search destinations"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                </div>

                <!-- Check-in -->
                <div class="md:col-span-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Check in</label>
                  <input
                    v-model="searchForm.checkIn"
                    type="date"
                    :min="today"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                </div>

                <!-- Check-out -->
                <div class="md:col-span-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Check out</label>
                  <input
                    v-model="searchForm.checkOut"
                    type="date"
                    :min="searchForm.checkIn || today"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                </div>

                <!-- Guests -->
                <div class="md:col-span-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <select
                    v-model="searchForm.guests"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Any</option>
                    <option value="1">1 guest</option>
                    <option value="2">2 guests</option>
                    <option value="4">4 guests</option>
                    <option value="6">6 guests</option>
                    <option value="8">8+ guests</option>
                  </select>
                </div>

                <!-- Search Button -->
                <div class="md:col-span-4 flex justify-center">
                  <button
                    type="submit"
                    class="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center space-x-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          Explore by Category
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          <div 
            v-for="category in categories" 
            :key="category.name"
            @click="searchByCategory(category.name)"
            class="text-center cursor-pointer group"
          >
            <div class="w-16 h-16 mx-auto mb-3 text-4xl group-hover:scale-110 transition-transform">
              {{ category.icon }}
            </div>
            <p class="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
              {{ category.name }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Spots Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Featured Camping Spots</h2>
          <router-link 
            to="/spots" 
            class="text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            View all →
          </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="n in 6" 
            :key="n"
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
          >
            <div class="aspect-[4/3] bg-gray-300"></div>
            <div class="p-4">
              <div class="h-4 bg-gray-300 rounded mb-2"></div>
              <div class="h-6 bg-gray-300 rounded mb-2"></div>
              <div class="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- Spots Grid -->
        <div v-else-if="featuredSpots.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CampingCard 
            v-for="spot in featuredSpots" 
            :key="spot.id" 
            :spot="spot"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No camping spots available</h3>
          <p class="text-gray-600">Check back later for new additions.</p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose CampingHub?
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Epic Spots, No Sweat</h3>
            <p class="text-gray-600">Discover and book cool camping spots with just a few clicks.</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Booking Made Easy</h3>
            <p class="text-gray-600">A super simple booking process because who needs the hassle?</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Adventure on a Budget</h3>
            <p class="text-gray-600">Great finds that won't break the bank.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-primary">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-white mb-4">
          Ready for Your Next Adventure?
        </h2>
        <p class="text-xl text-white/90 mb-8">
          Join thousands of happy campers and discover your perfect spot today.
        </p>
        <div class="space-x-4">
          <router-link 
            to="/spots" 
            class="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Browse Spots
          </router-link>
          <router-link 
            v-if="!authStore.isAuthenticated"
            to="/register" 
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors inline-block"
          >
            Sign Up Free
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import CampingCard from '@/components/camping/CampingCard.vue'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const featuredSpots = ref([])

const searchForm = ref({
  location: '',
  checkIn: '',
  checkOut: '',
  guests: ''
})

const categories = [
  { name: 'Beach', icon: '🏖️' },
  { name: 'Forest', icon: '🌲' },
  { name: 'Mountains', icon: '🏔️' },
  { name: 'Lake', icon: '🏞️' },
  { name: 'Desert', icon: '🏜️' },
  { name: 'River', icon: '🏞️' },
  { name: 'Hills', icon: '⛰️' },
  { name: 'Valley', icon: '🌄' }
]

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const fetchFeaturedSpots = async () => {
  try {
    loading.value = true
    const response = await api.getSpots({ limit: 6 })
    featuredSpots.value = response.data.spots
  } catch (error) {
    console.error('Error fetching featured spots:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  const query = {}
  
  if (searchForm.value.location) query.location = searchForm.value.location
  if (searchForm.value.guests) query.capacity = searchForm.value.guests
  
  router.push({ name: 'CampingSpots', query })
}

const searchByCategory = (category) => {
  router.push({ 
    name: 'CampingSpots', 
    query: { search: category.toLowerCase() }
  })
}

onMounted(() => {
  fetchFeaturedSpots()
})
</script>