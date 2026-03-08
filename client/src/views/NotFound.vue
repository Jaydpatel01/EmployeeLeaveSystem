<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p class="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <router-link
        to="/"
        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors no-underline"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Go Home
      </router-link>
    </div>
  </div>
</template>

<script>
export default { name: 'NotFound' };
</script>
