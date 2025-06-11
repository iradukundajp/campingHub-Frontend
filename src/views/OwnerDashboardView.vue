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
            class="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
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
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 9l7 7 7-7-7-7z"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ stats.pendingBookings }}</h3>
              <p class="text-sm text-gray-600">Pending Approval</p>
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
              <h3 class="text-lg font-semibold text-gray-900">€{{ stats.totalRevenue.toFixed(2) }}</h3>
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
            :class="activeTab === tab.key ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
          >
            {{ tab.label }}
            <span v-if="tab.key === 'bookings' && stats.pendingBookings > 0" class="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
              {{ stats.pendingBookings }}
            </span>
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
            <div class="relative aspect-[4/3]">
              <img 
                :src="getSpotImage(spot)"
                :alt="spot.title"
                class="w-full h-full object-cover"
              >
              <div class="absolute top-3 right-3">
                <span 
                  :class="getSpotStatusClasses(spot)"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getSpotStatusText(spot) }}
                </span>
              </div>
            </div>

            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ spot.title }}</h3>
              <p class="text-gray-600 text-sm mb-2">{{ spot.location }}</p>
              
              <div class="flex items-center justify-between mb-3 text-sm text-gray-600">
                <span>Up to {{ spot.capacity }} guests</span>
                <span>€{{ formatPrice(spot.price) }}/night</span>
              </div>

              <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span>{{ spot.averageRating || 0 }} ({{ spot.totalReviews || 0 }})</span>
                </div>
                <span>{{ spot.totalBookings || 0 }} bookings</span>
              </div>

              <div class="flex space-x-2">
                <button
                  @click="editSpot(spot)"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  @click="toggleSpotStatus(spot)"
                  :class="getSpotActionClasses(spot)"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  {{ getSpotActionText(spot) }}
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
            class="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Add Your First Spot
          </button>
        </div>
      </div>

      <!-- Bookings Tab -->
      <div v-else-if="activeTab === 'bookings'">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Manage Bookings</h3>
              <div class="flex space-x-2">
                <select 
                  v-model="bookingFilter" 
                  @change="filterBookings"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="ALL">All Bookings</option>
                  <option value="PENDING">Pending Approval</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div v-if="filteredBookings.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spot</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="booking in filteredBookings" :key="booking.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span class="text-xs font-medium text-gray-700">
                            {{ booking.user.firstName?.charAt(0) }}{{ booking.user.lastName?.charAt(0) }}
                          </span>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ booking.user.firstName }} {{ booking.user.lastName }}
                          </div>
                          <div class="text-sm text-gray-500">{{ booking.user.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ booking.spot.title }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{{ formatDate(booking.checkIn) }}</div>
                      <div class="text-gray-500">to {{ formatDate(booking.checkOut) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ booking.guests }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{{ formatPrice(booking.totalPrice) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="getStatusClasses(booking.status)"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ booking.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div v-if="booking.status === 'PENDING'" class="flex space-x-2">
                        <button 
                          @click="approveBooking(booking)"
                          :disabled="bookingActionLoading[booking.id]"
                          class="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {{ bookingActionLoading[booking.id] ? 'Processing...' : 'Approve' }}
                        </button>
                        <button 
                          @click="rejectBooking(booking)"
                          :disabled="bookingActionLoading[booking.id]"
                          class="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {{ bookingActionLoading[booking.id] ? 'Processing...' : 'Reject' }}
                        </button>
                      </div>
                      <div v-else-if="booking.status === 'CONFIRMED'" class="text-green-600 text-xs">
                        ✓ Confirmed
                      </div>
                      <div v-else class="text-gray-500 text-xs">
                        {{ booking.status.toLowerCase() }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-else class="text-center py-12">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-2">No bookings found</h4>
              <p class="text-gray-600">
                {{ bookingFilter === 'ALL' ? 'You haven\'t received any bookings yet.' : `No ${bookingFilter.toLowerCase()} bookings found.` }}
              </p>
            </div>
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
      <div class="bg-white rounded-lg max-w-4xl w-full my-8" @click.stop>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">
            {{ editingSpot ? 'Edit Camping Spot' : 'Add New Camping Spot' }}
          </h3>

          <form @submit.prevent="submitSpot" class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Left Column - Basic Info -->
              <div class="space-y-6">
                <!-- Title -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    v-model="spotForm.title"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
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
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="City, Region"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Price per night (€)</label>
                    <input
                      v-model.number="spotForm.price"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="6"
                  >
                </div>

                <!-- Amenities -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div class="grid grid-cols-2 gap-2">
                    <label v-for="amenity in availableAmenities" :key="amenity" class="flex items-center">
                      <input
                        v-model="spotForm.amenities"
                        :value="amenity"
                        type="checkbox"
                        class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                      >
                      <span class="ml-2 text-sm text-gray-700">{{ amenity }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Right Column - Image Upload -->
              <div class="space-y-6">
                <!-- Image Upload Section -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Images</label>
                  
                  <!-- Upload Area -->
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      ref="imageInput"
                      type="file"
                      multiple
                      accept="image/*"
                      @change="handleImageUpload"
                      class="hidden"
                    >
                    
                    <div v-if="uploadedImages.length === 0" @click="$refs.imageInput.click()" class="cursor-pointer">
                      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                      <p class="text-gray-600 mb-2">Click to upload images</p>
                      <p class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                    </div>
                    
                    <button
                      v-else
                      type="button"
                      @click="$refs.imageInput.click()"
                      class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add More Images
                    </button>
                  </div>

                  <!-- Uploaded Images Preview -->
                  <div v-if="uploadedImages.length > 0" class="mt-4 grid grid-cols-2 gap-4">
                    <div 
                      v-for="(image, index) in uploadedImages" 
                      :key="index" 
                      class="relative group"
                    >
                      <img 
                        :src="image.url || image" 
                        :alt="`Spot image ${index + 1}`"
                        class="w-full h-32 object-cover rounded-lg border border-gray-200"
                      >
                      <button 
                        type="button"
                        @click="removeImage(index)" 
                        class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <div v-if="index === 0" class="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex space-x-3 pt-6 border-t border-gray-200">
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
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
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
if (authStore.user?.role !== 'OWNER' && authStore.user?.role !== 'ADMIN') {
  router.push('/')
}

const loading = ref(true)
const spots = ref([])
const bookings = ref([])
const activeTab = ref('spots')

const bookingFilter = ref('ALL')
const filteredBookings = ref([])
const bookingActionLoading = ref({})

const showAddSpotModal = ref(false)
const showEditSpotModal = ref(false)
const editingSpot = ref(null)
const submitLoading = ref(false)

// Image upload state
const uploadedImages = ref([])
const imageInput = ref(null)

const spotForm = ref({
  title: '',
  description: '',
  location: '',
  price: '',
  capacity: '',
  amenities: [],
  images: []
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
  const activeSpots = spots.value.filter(spot => spot.isActive !== false).length
  const totalBookings = bookings.value.length
  const pendingBookings = bookings.value.filter(booking => booking.status === 'PENDING').length
  const totalRevenue = bookings.value
    .filter(booking => booking.status === 'CONFIRMED' || booking.status === 'COMPLETED')
    .reduce((sum, booking) => sum + parseFloat(booking.totalPrice || 0), 0)

  return {
    totalSpots,
    activeSpots,
    totalBookings,
    pendingBookings,
    totalRevenue
  }
})

// Helper functions
const formatPrice = (price) => {
  return parseFloat(price || 0).toFixed(2)
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
  return 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400'
}

const getSpotStatusClasses = (spot) => {
  if (spot.isActive === false) {
    return 'bg-red-100 text-red-800'
  }
  return 'bg-green-100 text-green-800'
}

const getSpotStatusText = (spot) => {
  if (spot.isActive === false) {
    return 'Inactive'
  }
  return 'Active'
}

const getSpotActionClasses = (spot) => {
  if (spot.isActive === false) {
    return 'text-green-600 hover:text-green-700'
  }
  return 'text-red-600 hover:text-red-700'
}

const getSpotActionText = (spot) => {
  if (spot.isActive === false) {
    return 'Activate'
  }
  return 'Deactivate'
}

const getStatusClasses = (status) => {
  switch (status?.toUpperCase()) {
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

const filterBookings = () => {
  if (bookingFilter.value === 'ALL') {
    filteredBookings.value = bookings.value
  } else {
    filteredBookings.value = bookings.value.filter(booking => 
      booking.status === bookingFilter.value
    )
  }
}

// Fetch spots function with error handling
const fetchSpots = async () => {
  try {
    const response = await api.getOwnerSpots()
    
    if (response.data) {
      if (response.data.spots) {
        spots.value = response.data.spots
      } else if (Array.isArray(response.data)) {
        spots.value = response.data
      } else {
        spots.value = []
      }
    } else {
      spots.value = []
    }
  } catch (error) {
    console.error('Error fetching spots:', error)
    spots.value = []
  }
}

const fetchBookings = async () => {
  try {
    const response = await api.getOwnerBookings()
    
    if (response.data) {
      if (response.data.bookings) {
        bookings.value = response.data.bookings
      } else if (Array.isArray(response.data)) {
        bookings.value = response.data
      } else {
        bookings.value = []
      }
    } else {
      bookings.value = []
    }
    
    filterBookings()
  } catch (error) {
    console.error('Error fetching bookings:', error)
    bookings.value = []
  }
}

const approveBooking = async (booking) => {
  bookingActionLoading.value[booking.id] = true
  
  try {
    await api.approveBooking(booking.id, 'Booking approved by owner')
    
    const bookingIndex = bookings.value.findIndex(b => b.id === booking.id)
    if (bookingIndex !== -1) {
      bookings.value[bookingIndex].status = 'CONFIRMED'
    }
    
    filterBookings()
    
  } catch (error) {
    console.error('Error approving booking:', error)
    alert('Failed to approve booking. Please try again.')
  } finally {
    bookingActionLoading.value[booking.id] = false
  }
}

const rejectBooking = async (booking) => {
  const reason = prompt('Please provide a reason for rejection (optional):')
  
  bookingActionLoading.value[booking.id] = true
  
  try {
    await api.rejectBooking(booking.id, reason || 'Booking rejected by owner')
    
    const bookingIndex = bookings.value.findIndex(b => b.id === booking.id)
    if (bookingIndex !== -1) {
      bookings.value[bookingIndex].status = 'CANCELLED'
    }
    
    filterBookings()
    
  } catch (error) {
    console.error('Error rejecting booking:', error)
    alert('Failed to reject booking. Please try again.')
  } finally {
    bookingActionLoading.value[booking.id] = false
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
    amenities: spot.amenities || [],
    images: spot.images || []
  }
  
  // Load existing images
  uploadedImages.value = (spot.images || []).map(url => 
    typeof url === 'string' ? url : (url.url || url)
  )
  
  showEditSpotModal.value = true
}

const toggleSpotStatus = async (spot) => {
  try {
    const newStatus = !spot.isActive
    await api.updateOwnerSpot(spot.id, { isActive: newStatus })
    spot.isActive = newStatus
  } catch (error) {
    console.error('Error updating spot status:', error)
    alert('Failed to update spot status. Please try again.')
  }
}

// Image upload handling
const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files)
  
  if (files.length === 0) return
  
  for (const file of files) {
    try {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        continue
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not an image.`)
        continue
      }
      
      // Create preview URL for immediate display
      const previewUrl = URL.createObjectURL(file)
      uploadedImages.value.push(previewUrl)
      
    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Failed to upload ${file.name}. Please try again.`)
    }
  }
  
  // Clear input
  event.target.value = ''
}

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1)
}

const submitSpot = async () => {
  submitLoading.value = true

  try {
    const spotData = {
      ...spotForm.value,
      images: uploadedImages.value
    }
    
    if (editingSpot.value) {
      await api.updateOwnerSpot(editingSpot.value.id, spotData)
      const index = spots.value.findIndex(s => s.id === editingSpot.value.id)
      if (index !== -1) {
        spots.value[index] = { ...spots.value[index], ...spotData }
      }
    } else {
      const response = await api.createOwnerSpot(spotData)
      if (response.data && response.data.spot) {
        spots.value.unshift(response.data.spot)
      }
    }
    
    closeModals()
  } catch (error) {
    console.error('Error submitting spot:', error)
    alert('Failed to save spot. Please try again.')
  } finally {
    submitLoading.value = false
  }
}

const closeModals = () => {
  showAddSpotModal.value = false
  showEditSpotModal.value = false
  editingSpot.value = null
  uploadedImages.value = []
  spotForm.value = {
    title: '',
    description: '',
    location: '',
    price: '',
    capacity: '',
    amenities: [],
    images: []
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