<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3 cursor-pointer" @click="$router.push('/')">
            <div class="text-2xl">🏕️</div>
            <span class="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              CampingHub
            </span>
            <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          
          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <router-link 
              to="/"
              class="text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Back to Site
            </router-link>
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span class="text-purple-600 font-medium text-sm">
                  {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
                </span>
              </div>
              <div class="hidden md:block">
                <p class="text-sm font-medium text-gray-900">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>
                <p class="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button 
              @click="authStore.logout"
              class="text-gray-600 hover:text-red-600 transition-colors duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 flex items-center">
          <svg class="w-8 h-8 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/>
          </svg>
          Admin Dashboard
        </h1>
        <p class="text-gray-600 mt-2">System administration and management</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM9 7a1 1 0 000-2 1 1 0 000 2zM7 16.75A6.98 6.98 0 0015 11v-1a2 2 0 00-2-2H7a2 2 0 00-2 2v1a6.98 6.98 0 008 5.75z"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ stats.totalUsers }}</h3>
              <p class="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center text-sm text-green-600">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
              +{{ stats.newUsersThisMonth }} this month
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ stats.totalSpots }}</h3>
              <p class="text-sm text-gray-600">Camping Spots</p>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center text-sm text-orange-600">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
              {{ stats.pendingSpots }} pending approval
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ stats.totalBookings }}</h3>
              <p class="text-sm text-gray-600">Total Bookings</p>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center text-sm text-blue-600">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
              {{ stats.activeBookings }} active
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.563-.649-1.413-1.076-2.353-1.253V5z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">€{{ stats.totalRevenue }}</h3>
              <p class="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center text-sm text-green-600">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              </svg>
              +€{{ stats.revenueThisMonth }} this month
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <nav class="flex space-x-8 border-b border-gray-200">
          <button
            v-for="tab in adminTabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="activeTab === tab.key 
              ? 'border-purple-500 text-purple-600 bg-purple-50' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg"
          >
            <div class="flex items-center space-x-2">
              <component :is="tab.icon" class="w-5 h-5" />
              <span>{{ tab.label }}</span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <!-- Users Management -->
        <div v-if="activeTab === 'users'" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">User Management</h3>
            <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
              <span>Add User</span>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">User Overview</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ stats.adminUsers }}</div>
                  <div class="text-sm text-gray-600">Administrators</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">{{ stats.ownerUsers }}</div>
                  <div class="text-sm text-gray-600">Spot Owners</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-600">{{ stats.regularUsers }}</div>
                  <div class="text-sm text-gray-600">Regular Users</div>
                </div>
              </div>
            </div>
            
            <div class="text-center py-12">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-2">User Management Interface</h4>
              <p class="text-gray-600 mb-4">Comprehensive user management tools coming soon</p>
              <div class="space-y-2 text-sm text-gray-500">
                <p>• View and edit user profiles</p>
                <p>• Manage user roles and permissions</p>
                <p>• Monitor user activity and statistics</p>
                <p>• Handle user reports and moderation</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Spots Management -->
        <div v-else-if="activeTab === 'spots'" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Camping Spot Management</h3>
            <div class="flex space-x-2">
              <button class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center space-x-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Review Pending ({{ stats.pendingSpots }})</span>
              </button>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">Spot Statistics</h4>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">{{ stats.activeSpots }}</div>
                  <div class="text-sm text-gray-600">Active Spots</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-600">{{ stats.pendingSpots }}</div>
                  <div class="text-sm text-gray-600">Pending Review</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-red-600">{{ stats.inactiveSpots }}</div>
                  <div class="text-sm text-gray-600">Inactive</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ stats.featuredSpots }}</div>
                  <div class="text-sm text-gray-600">Featured</div>
                </div>
              </div>
            </div>
            
            <div class="text-center py-12">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-2">Spot Management Tools</h4>
              <p class="text-gray-600 mb-4">Advanced camping spot administration interface</p>
              <div class="space-y-2 text-sm text-gray-500">
                <p>• Approve or reject new camping spots</p>
                <p>• Moderate spot content and images</p>
                <p>• Feature spots on homepage</p>
                <p>• Monitor spot performance metrics</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings Management -->
        <div v-else-if="activeTab === 'bookings'" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Booking Management</h3>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span>Export Report</span>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">Booking Overview</h4>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">{{ stats.confirmedBookings }}</div>
                  <div class="text-sm text-gray-600">Confirmed</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-600">{{ stats.pendingBookings }}</div>
                  <div class="text-sm text-gray-600">Pending</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ stats.activeBookings }}</div>
                  <div class="text-sm text-gray-600">Active</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-600">{{ stats.completedBookings }}</div>
                  <div class="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
            
            <div class="text-center py-12">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-2">Booking Administration</h4>
              <p class="text-gray-600 mb-4">Comprehensive booking management system</p>
              <div class="space-y-2 text-sm text-gray-500">
                <p>• View all system bookings</p>
                <p>• Handle booking disputes</p>
                <p>• Generate financial reports</p>
                <p>• Monitor booking trends</p>
              </div>
            </div>
          </div>
        </div>

        <!-- System Settings -->
        <div v-else-if="activeTab === 'system'" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">System Settings</h3>
            <button class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
              </svg>
              <span>Backup System</span>
            </button>
          </div>
          
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">Platform Settings</h4>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Maintenance Mode</span>
                    <toggle-switch v-model="systemSettings.maintenanceMode" />
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">New Registrations</span>
                    <toggle-switch v-model="systemSettings.allowRegistrations" />
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Email Notifications</span>
                    <toggle-switch v-model="systemSettings.emailNotifications" />
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">Security Settings</h4>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Two-Factor Auth</span>
                    <toggle-switch v-model="systemSettings.twoFactorAuth" />
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Rate Limiting</span>
                    <toggle-switch v-model="systemSettings.rateLimiting" />
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Audit Logging</span>
                    <toggle-switch v-model="systemSettings.auditLogging" />
                  </div>
                </div>
              </div>
            </div>
            
            <div class="text-center py-8">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <h4 class="text-lg font-medium text-gray-900 mb-2">Advanced Configuration</h4>
              <p class="text-gray-600">System-wide settings and configuration options</p>
            </div>
          </div>
        </div>

        <!-- Analytics Tab -->
        <div v-else-if="activeTab === 'analytics'" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Analytics & Reports</h3>
            <div class="flex space-x-2">
              <select class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
            </div>
          </div>
          
          <div class="text-center py-12">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <h4 class="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h4>
            <p class="text-gray-600 mb-4">Comprehensive platform analytics and insights</p>
            <div class="space-y-2 text-sm text-gray-500">
              <p>• User engagement metrics</p>
              <p>• Revenue and booking trends</p>
              <p>• Popular camping spots analysis</p>
              <p>• Performance dashboards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Redirect if not admin
if (!authStore.isAuthenticated || authStore.user?.role !== 'ADMIN') {
  router.push('/')
}

const activeTab = ref('users')

// Mock stats data - replace with real API calls
const stats = ref({
  totalUsers: 1247,
  newUsersThisMonth: 89,
  totalSpots: 156,
  pendingSpots: 7,
  activeSpots: 142,
  inactiveSpots: 7,
  featuredSpots: 12,
  totalBookings: 892,
  activeBookings: 23,
  confirmedBookings: 45,
  pendingBookings: 8,
  completedBookings: 816,
  totalRevenue: '45,230',
  revenueThisMonth: '8,450',
  adminUsers: 3,
  ownerUsers: 28,
  regularUsers: 1216
})

const systemSettings = ref({
  maintenanceMode: false,
  allowRegistrations: true,
  emailNotifications: true,
  twoFactorAuth: false,
  rateLimiting: true,
  auditLogging: true
})

const adminTabs = [
  { 
    key: 'users', 
    label: 'Users',
    icon: 'users-icon'
  },
  { 
    key: 'spots', 
    label: 'Spots',
    icon: 'spots-icon'
  },
  { 
    key: 'bookings', 
    label: 'Bookings',
    icon: 'bookings-icon'
  },
  { 
    key: 'analytics', 
    label: 'Analytics',
    icon: 'analytics-icon'
  },
  { 
    key: 'system', 
    label: 'System',
    icon: 'system-icon'
  }
]

// Simple toggle switch component
const ToggleSwitch = {
  template: `
    <button 
      @click="toggle"
      :class="modelValue ? 'bg-purple-600' : 'bg-gray-300'"
      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      <span 
        :class="modelValue ? 'translate-x-6' : 'translate-x-1'"
        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
      />
    </button>
  `,
  props: ['modelValue'],
  emits: ['update:modelValue'],
  methods: {
    toggle() {
      this.$emit('update:modelValue', !this.modelValue)
    }
  }
}

// Load admin statistics
const loadAdminStats = async () => {
  try {
    // Replace with actual API calls
    console.log('Loading admin statistics...')
  } catch (error) {
    console.error('Error loading admin stats:', error)
  }
}

onMounted(() => {
  loadAdminStats()
})
</script>

<style scoped>
/* Custom styles for admin dashboard */
.admin-card {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200;
}

.admin-stat {
  @apply text-center;
}

.admin-stat-number {
  @apply text-2xl font-bold;
}

.admin-stat-label {
  @apply text-sm text-gray-600;
}
</style>