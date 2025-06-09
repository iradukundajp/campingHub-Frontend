<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Camping Spots</h1>
            <p class="text-gray-600 mt-1">
              {{ totalSpots }} spots available in Belgium
            </p>
          </div>
          
          <!-- Quick Search -->
          <div class="mt-4 md:mt-0 md:max-w-md">
            <div class="relative">
              <input
                v-model="quickSearch"
                type="text"
                placeholder="Search spots..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                @input="debouncedSearch"
              >
              <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-4 lg:gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            
            <!-- Location Filter -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                v-model="filters.location"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Locations</option>
                <option value="Flanders">Flanders</option>
                <option value="Wallonia">Wallonia</option>
                <option value="Brussels">Brussels</option>
                <option value="Coast">Belgian Coast</option>
                <option value="Ardennes">Ardennes</option>
              </select>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Price per night: €{{ filters.minPrice }} - €{{ filters.maxPrice }}
              </label>
              <div class="space-y-3">
                <div>
                  <label class="text-xs text-gray-500">Min Price</label>
                  <input
                    v-model.number="filters.minPrice"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    @input="applyFilters"
                    class="w-full accent-green-500"
                  >
                </div>
                <div>
                  <label class="text-xs text-gray-500">Max Price</label>
                  <input
                    v-model.number="filters.maxPrice"
                    type="range"
                    min="20"
                    max="150"
                    step="5"
                    @input="applyFilters"
                    class="w-full accent-green-500"
                  >
                </div>
              </div>
            </div>

            <!-- Capacity -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Capacity</label>
              <select
                v-model="filters.capacity"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Any</option>
                <option value="1">1+ guests</option>
                <option value="2">2+ guests</option>
                <option value="4">4+ guests</option>
                <option value="6">6+ guests</option>
                <option value="8">8+ guests</option>
              </select>
            </div>

            <!-- Amenities -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
              <div class="space-y-2">
                <label 
                  v-for="amenity in popularAmenities" 
                  :key="amenity"
                  class="flex items-center"
                >
                  <input
                    v-model="filters.amenities"
                    :value="amenity"
                    type="checkbox"
                    @change="applyFilters"
                    class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-700">{{ amenity }}</span>
                </label>
              </div>
            </div>

            <!-- Sort Options -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                v-model="sortBy"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="createdAt,desc">Newest first</option>
                <option value="price,asc">Price: Low to High</option>
                <option value="price,desc">Price: High to Low</option>
                <option value="capacity,desc">Capacity: High to Low</option>
                <option value="title,asc">Name: A to Z</option>
                <option value="averageRating,desc">Highest Rated</option>
              </select>
            </div>

            <!-- Clear Filters -->
            <button
              @click="clearFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <div class="lg:col-span-3 mt-8 lg:mt-0">
          <!-- Results Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="text-sm text-gray-600">
              Showing {{ spots.length }} of {{ totalSpots }} spots
            </div>
            
            <!-- View Toggle -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">View:</span>
              <button
                @click="viewMode = 'grid'"
                :class="viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'"
                class="p-2 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'"
                class="p-2 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="space-y-6">
            <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div class="aspect-[4/3] bg-gray-300 rounded-t-lg"></div>
              <div class="p-4">
                <div class="h-4 bg-gray-300 rounded mb-2"></div>
                <div class="h-6 bg-gray-300 rounded mb-2"></div>
                <div class="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>

          <!-- Results Grid/List -->
          <div v-else-if="spots.length > 0">
            <!-- Grid View -->
            <div 
              v-if="viewMode === 'grid'" 
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <div 
                v-for="spot in spots" 
                :key="spot.id"
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                @click="viewSpot(spot.id)"
              >
                <!-- Image -->
                <div class="relative aspect-[4/3]">
                  <img 
                    :src="getSpotImage(spot)"
                    :alt="spot.title"
                    class="w-full h-full object-cover"
                  >
                  <div class="absolute top-3 right-3">
                    <button 
                      @click.stop="toggleHeart(spot.id)"
                      class="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <svg 
                        class="w-4 h-4 transition-colors" 
                        :class="likedSpots.includes(spot.id) ? 'text-red-500 fill-current' : 'text-gray-600'"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Content -->
                <div class="p-4">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold text-gray-900 line-clamp-1">{{ spot.title }}</h3>
                    <div v-if="spot.averageRating" class="flex items-center text-sm">
                      <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span class="text-gray-900 font-medium">{{ spot.averageRating }}</span>
                    </div>
                  </div>
                  
                  <p class="text-gray-600 text-sm mb-2">{{ spot.location }}</p>
                  <p class="text-gray-700 text-sm mb-3 line-clamp-2">{{ spot.description }}</p>
                  
                  <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>Up to {{ spot.capacity }} guests</span>
                    <span v-if="spot.totalReviews" class="text-gray-500">{{ spot.totalReviews }} reviews</span>
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div class="text-lg">
                      <span class="font-bold text-gray-900">${{ formatPrice(spot.price) }}</span>
                      <span class="text-gray-600 text-sm"> / night</span>
                    </div>
                    <span 
                      :class="spot.isInstantBook ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ spot.isInstantBook ? 'Instant Book' : 'Request' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- List View -->
            <div v-else class="space-y-4">
              <div 
                v-for="spot in spots" 
                :key="spot.id"
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                @click="viewSpot(spot.id)"
              >
                <div class="md:flex">
                  <div class="md:w-1/3">
                    <img 
                      :src="getSpotImage(spot)"
                      :alt="spot.title"
                      class="w-full h-48 md:h-full object-cover"
                    >
                  </div>
                  <div class="md:w-2/3 p-6">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-lg font-semibold text-gray-900">{{ spot.title }}</h3>
                      <div v-if="spot.averageRating" class="flex items-center text-sm">
                        <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span class="text-gray-900 font-medium">{{ spot.averageRating }}</span>
                      </div>
                    </div>
                    
                    <p class="text-gray-600 text-sm mb-2">{{ spot.location }}</p>
                    <p class="text-gray-700 mb-4 line-clamp-2">{{ spot.description }}</p>
                    
                    <div class="flex items-center justify-between">
                      <div class="text-lg">
                        <span class="font-bold text-gray-900">${{ formatPrice(spot.price) }}</span>
                        <span class="text-gray-600 text-sm"> / night</span>
                      </div>
                      <button 
                        @click.stop="viewSpot(spot.id)"
                        class="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-8 flex justify-center">
              <nav class="flex items-center space-x-2">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="page === currentPage ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
                  class="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {{ page }}
                </button>
                
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No camping spots found</h3>
            <p class="text-gray-600">Try adjusting your filters or search criteria.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const spots = ref([])
const totalSpots = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const viewMode = ref('grid')
const quickSearch = ref('')
const likedSpots = ref(JSON.parse(localStorage.getItem('likedSpots') || '[]'))

const filters = ref({
  location: '',
  minPrice: 0,
  maxPrice: 100,
  capacity: '',
  amenities: []
})

const sortBy = ref('createdAt,desc')

const popularAmenities = [
  'WiFi',
  'Swimming Pool',
  'Restaurant',
  'Kids Playground',
  'Pet Friendly',
  'Bike Rental',
  'Hiking Trails',
  'Campfire Area'
]

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchSpots()
  }, 500)
}

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2)
}

const getSpotImage = (spot) => {
  if (spot.images && spot.images.length > 0) {
    return spot.images[0]
  }
  return 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400'
}

const toggleHeart = (spotId) => {
  const index = likedSpots.value.indexOf(spotId)
  if (index > -1) {
    likedSpots.value.splice(index, 1)
  } else {
    likedSpots.value.push(spotId)
  }
  localStorage.setItem('likedSpots', JSON.stringify(likedSpots.value))
}

const viewSpot = (spotId) => {
  router.push(`/spots/${spotId}`)
}

const fetchSpots = async () => {
  try {
    loading.value = true
    
    const params = {
      page: currentPage.value,
      limit: 12
    }

    // Add search
    if (quickSearch.value) {
      params.search = quickSearch.value
    }

    // Add filters
    if (filters.value.location) params.location = filters.value.location
    if (filters.value.minPrice > 0) params.minPrice = filters.value.minPrice
    if (filters.value.maxPrice < 100) params.maxPrice = filters.value.maxPrice
    if (filters.value.capacity) params.capacity = filters.value.capacity

    // Add sorting
    const [sortField, sortOrder] = sortBy.value.split(',')
    params.sortBy = sortField
    params.sortOrder = sortOrder

    console.log('Fetching spots with params:', params)

    const response = await api.getSpots(params)
    console.log('Spots response:', response.data)
    
    const { spots: fetchedSpots, pagination } = response.data

    spots.value = fetchedSpots || []
    totalSpots.value = pagination?.total || 0
    totalPages.value = pagination?.totalPages || 1

  } catch (error) {
    console.error('Error fetching spots:', error)
    spots.value = []
    totalSpots.value = 0
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchSpots()
}

const clearFilters = () => {
  filters.value = {
    location: '',
    minPrice: 0,
    maxPrice: 100,
    capacity: '',
    amenities: []
  }
  quickSearch.value = ''
  sortBy.value = 'createdAt,desc'
  currentPage.value = 1
  fetchSpots()
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchSpots()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Initialize from route query
onMounted(() => {
  if (route.query.search) quickSearch.value = route.query.search
  if (route.query.location) filters.value.location = route.query.location
  if (route.query.capacity) filters.value.capacity = route.query.capacity
  
  fetchSpots()
})

// Watch for route changes
watch(() => route.query, (newQuery) => {
  if (newQuery.search !== undefined) quickSearch.value = newQuery.search || ''
  if (newQuery.location !== undefined) filters.value.location = newQuery.location || ''
  if (newQuery.capacity !== undefined) filters.value.capacity = newQuery.capacity || ''
  
  fetchSpots()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>