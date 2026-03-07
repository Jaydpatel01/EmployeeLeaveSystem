<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Employer Dashboard</h1>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-xl shadow-md p-5">
        <p class="text-sm text-gray-500">Total Requests</p>
        <p class="text-2xl font-bold text-gray-800">{{ leaves.length }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-md p-5">
        <p class="text-sm text-gray-500">Pending</p>
        <p class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-md p-5">
        <p class="text-sm text-gray-500">Reviewed</p>
        <p class="text-2xl font-bold text-green-600">{{ reviewedCount }}</p>
      </div>
    </div>

    <!-- Leave Requests Table -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">All Leave Requests</h2>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        {{ error }}
      </div>

      <div v-if="successMsg" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
        {{ successMsg }}
      </div>

      <div v-if="loading" class="text-center py-8 text-gray-500">Loading...</div>

      <div v-else-if="leaves.length === 0" class="text-center py-8 text-gray-400">
        No leave requests found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 font-medium text-gray-600">Employee</th>
              <th class="px-4 py-3 font-medium text-gray-600">Email</th>
              <th class="px-4 py-3 font-medium text-gray-600">Type</th>
              <th class="px-4 py-3 font-medium text-gray-600">Start</th>
              <th class="px-4 py-3 font-medium text-gray-600">End</th>
              <th class="px-4 py-3 font-medium text-gray-600">Reason</th>
              <th class="px-4 py-3 font-medium text-gray-600">Status</th>
              <th class="px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="leave in leaves" :key="leave._id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ leave.employee?.name }}</td>
              <td class="px-4 py-3 text-gray-500">{{ leave.employee?.email }}</td>
              <td class="px-4 py-3 capitalize">{{ leave.leaveType }}</td>
              <td class="px-4 py-3">{{ formatDate(leave.startDate) }}</td>
              <td class="px-4 py-3">{{ formatDate(leave.endDate) }}</td>
              <td class="px-4 py-3 max-w-xs truncate">{{ leave.reason }}</td>
              <td class="px-4 py-3">
                <span
                  :class="statusClass(leave.status)"
                  class="px-2.5 py-1 rounded-full text-xs font-medium"
                >
                  {{ leave.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div v-if="leave.status === 'Pending'" class="flex space-x-2">
                  <button
                    @click="updateStatus(leave._id, 'Approved')"
                    :disabled="updating === leave._id"
                    class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    @click="updateStatus(leave._id, 'Rejected')"
                    :disabled="updating === leave._id"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
                <span v-else class="text-gray-400 text-xs">Reviewed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'EmployerDashboard',
  data() {
    return {
      leaves: [],
      loading: true,
      updating: null,
      error: '',
      successMsg: '',
    };
  },
  computed: {
    pendingCount() {
      return this.leaves.filter((l) => l.status === 'Pending').length;
    },
    reviewedCount() {
      return this.leaves.filter((l) => l.status !== 'Pending').length;
    },
  },
  mounted() {
    this.fetchLeaves();
  },
  methods: {
    async fetchLeaves() {
      try {
        const { data } = await api.get('/leaves');
        this.leaves = data.leaves;
      } catch (err) {
        this.error = 'Failed to load leave requests.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async updateStatus(id, status) {
      this.error = '';
      this.successMsg = '';
      this.updating = id;
      try {
        const { data } = await api.patch(`/leaves/${id}`, { status });
        this.successMsg = data.message;
        await this.fetchLeaves();
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update leave status.';
      } finally {
        this.updating = null;
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    },
    statusClass(status) {
      switch (status) {
        case 'Approved':
          return 'bg-green-100 text-green-700';
        case 'Rejected':
          return 'bg-red-100 text-red-700';
        default:
          return 'bg-yellow-100 text-yellow-700';
      }
    },
  },
};
</script>
