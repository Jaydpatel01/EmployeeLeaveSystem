<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav v-if="isLoggedIn" class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Brand -->
          <router-link :to="dashboardPath" class="flex items-center gap-2.5 no-underline">
            <div class="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-lg font-bold text-gray-900 hidden sm:inline">Leave Manager</span>
          </router-link>

          <!-- Right side -->
          <div class="flex items-center gap-4">
            <!-- User info -->
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span class="text-sm font-bold text-indigo-600">{{ userInitial }}</span>
              </div>
              <div class="hidden sm:block">
                <p class="text-sm font-semibold text-gray-800 leading-tight">{{ user?.name }}</p>
                <p class="text-xs text-gray-500 capitalize">{{ user?.role }}</p>
              </div>
            </div>

            <!-- Logout Button -->
            <button
              @click="logout"
              class="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-3 py-2 rounded-lg transition-all cursor-pointer"
              title="Sign out"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },
    user() {
      return JSON.parse(localStorage.getItem('user') || 'null');
    },
    userInitial() {
      return this.user?.name?.charAt(0)?.toUpperCase() || '?';
    },
    dashboardPath() {
      return this.user?.role === 'employer' ? '/employer/dashboard' : '/employee/dashboard';
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
};
</script>
