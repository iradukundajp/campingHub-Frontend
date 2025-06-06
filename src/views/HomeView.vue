<template>
  <div class="min-h-screen relative overflow-x-hidden">
    <!-- Hero Background with Image -->
    <div class="fixed inset-0 z-0">
      <!-- Beautiful Camping Background -->
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
      ></div>
      
      <!-- Overlay for better text readability -->
      <div class="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/30"></div>
      
      <!-- Animated floating elements -->
      <div 
        class="absolute inset-0 opacity-30"
        :style="{ transform: `translate(${mouseX * 0.02}px, ${mouseY * 0.02}px)` }"
      >
        <div class="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-300/30 to-blue-300/30 rounded-full blur-3xl animate-float"></div>
        <div class="absolute top-40 right-32 w-96 h-96 bg-gradient-to-r from-teal-300/20 to-green-300/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div class="absolute bottom-32 left-32 w-80 h-80 bg-gradient-to-r from-blue-300/30 to-purple-300/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>
    </div>

    <!-- Navigation -->
    <nav 
      class="fixed top-0 w-full z-50 transition-all duration-300"
      :class="scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg py-3' : 'bg-black/20 backdrop-blur-lg py-5'"
    >
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <div class="flex items-center space-x-3 cursor-pointer group">
            <div class="text-3xl group-hover:scale-110 transition-transform duration-300">🏕️</div>
            <span 
              class="text-2xl font-bold transition-all duration-300"
              :class="scrolled ? 'bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent' : 'text-white'"
            >
              CampingHub
            </span>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#" 
               :class="scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-green-300'"
               class="transition-colors duration-300 relative group">
              Explore
              <span 
                :class="scrolled ? 'bg-green-600' : 'bg-green-300'"
                class="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
              ></span>
            </a>
            <a href="#" 
               :class="scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-green-300'"
               class="transition-colors duration-300 relative group">
              Experiences
              <span 
                :class="scrolled ? 'bg-green-600' : 'bg-green-300'"
                class="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
              ></span>
            </a>
            <a href="#" 
               :class="scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-green-300'"
               class="transition-colors duration-300 relative group">
              Host
              <span 
                :class="scrolled ? 'bg-green-600' : 'bg-green-300'"
                class="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
              ></span>
            </a>
          </div>
          
          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <button 
              :class="scrolled ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-green-300'"
              class="hidden md:block transition-colors duration-300 font-medium">
              Become a host
            </button>
            <button class="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2.5 rounded-full hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="min-h-screen flex items-center justify-center px-6 pt-20 relative z-10">
      <div class="text-center max-w-4xl mx-auto">
        <h1 class="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent leading-tight animate-fade-in drop-shadow-lg">
          Find Your Perfect
          <br>
          <span class="relative">
            Camping Spot
            <div class="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-green-400/60 to-teal-400/60 opacity-70 -z-10 transform -skew-y-1"></div>
          </span>
        </h1>
        
        <p class="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed drop-shadow-md">
          Discover breathtaking camping experiences across Belgium and create memories that last a lifetime
        </p>
        
        <!-- Enhanced Search Bar -->
        <div class="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-3 shadow-2xl max-w-4xl mx-auto hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div 
              class="search-field group p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/60"
              @click="focusField('location')"
            >
              <label class="block text-sm font-semibold text-gray-700 mb-1">Where</label>
              <input 
                ref="locationInput"
                v-model="searchData.location"
                type="text" 
                placeholder="Search destinations"
                class="w-full bg-transparent text-gray-600 placeholder-gray-400 border-none outline-none text-sm"
              >
            </div>
            
            <div 
              class="search-field group p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/60"
              @click="focusField('checkin')"
            >
              <label class="block text-sm font-semibold text-gray-700 mb-1">Check in</label>
              <input 
                ref="checkinInput"
                v-model="searchData.checkin"
                type="text" 
                placeholder="Add dates"
                class="w-full bg-transparent text-gray-600 placeholder-gray-400 border-none outline-none text-sm"
              >
            </div>
            
            <div 
              class="search-field group p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/60"
              @click="focusField('checkout')"
            >
              <label class="block text-sm font-semibold text-gray-700 mb-1">Check out</label>
              <input 
                ref="checkoutInput"
                v-model="searchData.checkout"
                type="text" 
                placeholder="Add dates"
                class="w-full bg-transparent text-gray-600 placeholder-gray-400 border-none outline-none text-sm"
              >
            </div>
            
            <div class="flex items-center">
              <div 
                class="search-field group p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white/60 flex-1"
                @click="focusField('guests')"
              >
                <label class="block text-sm font-semibold text-gray-700 mb-1">Guests</label>
                <input 
                  ref="guestsInput"
                  v-model="searchData.guests"
                  type="text" 
                  placeholder="Add guests"
                  class="w-full bg-transparent text-gray-600 placeholder-gray-400 border-none outline-none text-sm"
                >
              </div>
              
              <button 
                class="ml-4 bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-2xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                @click="handleSearch"
                :disabled="isSearching"
              >
                <svg v-if="!isSearching" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <div v-else class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Selection -->
    <section class="py-20 relative z-10 bg-white/95 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-800 mb-4">Explore by Category</h2>
          <p class="text-lg text-gray-600">Find the perfect camping experience for your adventure</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          <div 
            v-for="category in categories" 
            :key="category.name"
            class="category-card group bg-white/60 backdrop-blur-lg rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:bg-white/80 hover:shadow-xl hover:-translate-y-2 border border-white/20"
            :class="{ 'ring-2 ring-green-500 bg-green-50/60': selectedCategory === category.name }"
            @click="selectCategory(category.name)"
          >
            <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 filter group-hover:drop-shadow-lg">
              {{ category.icon }}
            </div>
            <h3 class="font-semibold text-gray-700 group-hover:text-green-600 transition-colors duration-300 text-sm">
              {{ category.name }}
            </h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Listings -->
    <section class="py-20 relative z-10 bg-gradient-to-br from-gray-50/95 to-white/95 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-800 mb-4">Popular Camping Spots</h2>
          <p class="text-lg text-gray-600">Handpicked locations for unforgettable outdoor adventures</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="spot in featuredSpots" 
            :key="spot.id"
            class="listing-card group bg-white/60 backdrop-blur-lg rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:bg-white/80 hover:shadow-2xl hover:-translate-y-3 border border-white/20"
            @click="viewSpot(spot.id)"
          >
            <!-- Heart Icon -->
            <div class="absolute top-4 right-4 z-20">
              <button 
                class="heart-icon w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110"
                @click.stop="toggleHeart(spot.id)"
              >
                <svg 
                  class="w-5 h-5 transition-colors duration-300" 
                  :class="likedSpots.includes(spot.id) ? 'text-red-500 fill-current' : 'text-gray-600'"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
            
            <!-- Image -->
            <div class="relative h-56 overflow-hidden">
              <div 
                class="w-full h-full bg-gradient-to-br transition-transform duration-700 group-hover:scale-110"
                :style="{ background: spot.gradient }"
              ></div>
              <div class="absolute bottom-4 left-4">
                <span class="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {{ spot.type }}
                </span>
              </div>
            </div>
            
            <!-- Content -->
            <div class="p-6">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                  {{ spot.name }}
                </h3>
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-sm text-gray-600 font-medium">{{ spot.rating }}</span>
                </div>
              </div>
              
              <p class="text-gray-600 text-sm mb-4">{{ spot.location }}</p>
              
              <div class="flex justify-between items-center">
                <div>
                  <span class="text-xl font-bold text-gray-800">€{{ spot.price }}</span>
                  <span class="text-gray-500 text-sm"> / night</span>
                </div>
                <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive data
const scrolled = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const selectedCategory = ref('')
const isSearching = ref(false)
const likedSpots = ref([])

const searchData = ref({
  location: '',
  checkin: '',
  checkout: '',
  guests: ''
})

// Categories
const categories = [
  { name: 'Forest', icon: '🌲' },
  { name: 'Lake', icon: '🏞️' },
  { name: 'Beach', icon: '🏖️' },
  { name: 'Mountain', icon: '⛰️' },
  { name: 'Glamping', icon: '✨' },
  { name: 'Family', icon: '👨‍👩‍👧‍👦' },
  { name: 'Pet Friendly', icon: '🐕' },
  { name: 'Adventure', icon: '🎒' }
]

// Featured spots with gradients
const featuredSpots = [
  {
    id: 1,
    name: 'Forest Haven Retreat',
    location: 'Ardennes Forest, Belgium',
    price: 45,
    rating: 4.9,
    type: 'Forest Camping',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: 'Lakeside Paradise',
    location: 'Lake Genval, Belgium',
    price: 38,
    rating: 4.8,
    type: 'Lakeside',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    name: 'Mountain View Camp',
    location: 'High Fens, Belgium',
    price: 52,
    rating: 4.7,
    type: 'Mountain',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    name: 'Coastal Escape',
    location: 'North Sea Coast, Belgium',
    price: 60,
    rating: 4.9,
    type: 'Beach',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 5,
    name: 'Wildlife Sanctuary',
    location: 'Hoge Kempen National Park',
    price: 42,
    rating: 4.8,
    type: 'Nature Reserve',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 6,
    name: 'Historic Grounds',
    location: 'Bruges Countryside',
    price: 48,
    rating: 4.6,
    type: 'Historic',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  }
]

// Methods
const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

const handleMouseMove = (e) => {
  mouseX.value = (e.clientX - window.innerWidth / 2) / 50
  mouseY.value = (e.clientY - window.innerHeight / 2) / 50
}

const focusField = (field) => {
  const inputs = {
    location: 'locationInput',
    checkin: 'checkinInput',
    checkout: 'checkoutInput',
    guests: 'guestsInput'
  }
  // Focus would work with refs in a real component
  console.log(`Focus ${field}`)
}

const selectCategory = (category) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category
}

const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    isSearching.value = false
    console.log('Search completed:', searchData.value)
  }, 2000)
}

const toggleHeart = (id) => {
  const index = likedSpots.value.indexOf(id)
  if (index > -1) {
    likedSpots.value.splice(index, 1)
  } else {
    likedSpots.value.push(id)
  }
}

const viewSpot = (id) => {
  console.log('Viewing spot:', id)
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(-180deg); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(90deg); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-delayed {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 25s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 30s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-fade-in-delayed {
  animation: fade-in-delayed 1s ease-out 0.2s both;
}

.listing-card:hover .heart-icon {
  transform: scale(1.1);
}

.search-field:hover {
  background: rgba(255, 255, 255, 0.4) !important;
}
</style>