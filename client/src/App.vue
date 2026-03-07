<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav v-if="isLoggedIn" class="bg-indigo-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-xl font-bold">Leave Manager</span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm">
              {{ user?.name }}
              <span class="bg-indigo-500 px-2 py-1 rounded-full text-xs ml-1 capitalize">{{ user?.role }}</span>
            </span>
            <button @click="logout" class="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Router View -->
    <router-view />
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
