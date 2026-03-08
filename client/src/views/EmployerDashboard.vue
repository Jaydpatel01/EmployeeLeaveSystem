<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
      <p class="text-gray-500 mt-1">Manage employee leave requests</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ leaves.length }}</p>
            <p class="text-xs text-gray-500">Total Requests</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</p>
            <p class="text-xs text-gray-500">Pending</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-green-600">{{ approvedCount }}</p>
            <p class="text-xs text-gray-500">Approved</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-red-600">{{ rejectedCount }}</p>
            <p class="text-xs text-gray-500">Rejected</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Leave Requests Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <h2 class="text-lg font-semibold text-gray-900">Leave Requests</h2>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <!-- Search -->
          <div class="relative flex-1 sm:flex-initial">
            <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search employee..."
              class="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 w-full sm:w-48"
            />
          </div>
          <!-- Filter -->
          <select v-model="statusFilter" class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-200 bg-white cursor-pointer">
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <!-- Alerts -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
        <svg class="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
        <span>{{ error }}</span>
      </div>
      <div v-if="successMsg" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
        <svg class="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
        <span>{{ successMsg }}</span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin w-8 h-8 text-indigo-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        <p class="text-gray-500">Loading leave requests...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredLeaves.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
        <p class="text-gray-500 font-medium">No leave requests found</p>
        <p class="text-gray-400 text-sm mt-1">{{ searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filter.' : 'Employee leave requests will appear here.' }}</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Employee</th>
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Type</th>
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Duration</th>
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Reason</th>
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Applied On</th>
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="leave in filteredLeaves" :key="leave._id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <div class="font-medium text-gray-800">{{ leave.employee?.name }}</div>
                <div class="text-xs text-gray-400">{{ leave.employee?.email }}</div>
              </td>
              <td class="px-4 py-3 capitalize text-gray-700">
                <span>{{ leaveTypeEmoji(leave.leaveType) }} {{ leave.leaveType }}</span>
              </td>
              <td class="px-4 py-3 text-gray-600">
                <div>{{ formatDate(leave.startDate) }} — {{ formatDate(leave.endDate) }}</div>
                <div class="text-xs text-gray-400">{{ calcDays(leave.startDate, leave.endDate) }} day{{ calcDays(leave.startDate, leave.endDate) !== 1 ? 's' : '' }}</div>
              </td>
              <td class="px-4 py-3 max-w-xs">
                <span class="text-gray-600 line-clamp-2">{{ leave.reason }}</span>
              </td>
              <td class="px-4 py-3">
                <span :class="statusBadge(leave.status)" class="px-2.5 py-1 rounded-full text-xs font-semibold">
                  {{ leave.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs">{{ formatDateTime(leave.createdAt) }}</td>
              <td class="px-4 py-3">
                <div v-if="leave.status === 'Pending'" class="flex items-center gap-2">
                  <button
                    @click="confirmAction(leave._id, 'Approved')"
                    :disabled="updating === leave._id"
                    class="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Approve
                  </button>
                  <button
                    @click="confirmAction(leave._id, 'Rejected')"
                    :disabled="updating === leave._id"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    Reject
                  </button>
                </div>
                <div v-else class="text-xs text-gray-400 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/></svg>
                  Reviewed
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="fixed inset-0 bg-black/40" @click="showConfirmModal = false"></div>
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10">
        <h3 class="text-lg font-bold text-gray-900 mb-2">
          {{ confirmStatus === 'Approved' ? 'Approve' : 'Reject' }} Leave Request
        </h3>
        <p class="text-gray-500 text-sm mb-6">
          Are you sure you want to <strong>{{ confirmStatus === 'Approved' ? 'approve' : 'reject' }}</strong> this leave request? This action cannot be undone.
        </p>
        <div class="flex gap-3 justify-end">
          <button @click="showConfirmModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            @click="executeAction()"
            :disabled="updating"
            :class="[
              'px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2',
              confirmStatus === 'Approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            ]"
          >
            <svg v-if="updating" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ confirmStatus === 'Approved' ? 'Approve' : 'Reject' }}
          </button>
        </div>
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
      statusFilter: 'all',
      searchQuery: '',
      showConfirmModal: false,
      confirmId: null,
      confirmStatus: null,
    };
  },
  computed: {
    pendingCount() { return this.leaves.filter(l => l.status === 'Pending').length; },
    approvedCount() { return this.leaves.filter(l => l.status === 'Approved').length; },
    rejectedCount() { return this.leaves.filter(l => l.status === 'Rejected').length; },
    filteredLeaves() {
      let result = this.leaves;
      if (this.statusFilter !== 'all') {
        result = result.filter(l => l.status === this.statusFilter);
      }
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        result = result.filter(l =>
          l.employee?.name?.toLowerCase().includes(q) ||
          l.employee?.email?.toLowerCase().includes(q)
        );
      }
      return result;
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
    confirmAction(id, status) {
      this.confirmId = id;
      this.confirmStatus = status;
      this.showConfirmModal = true;
    },
    async executeAction() {
      this.error = '';
      this.successMsg = '';
      this.updating = this.confirmId;
      try {
        const { data } = await api.patch(`/leaves/${this.confirmId}`, { status: this.confirmStatus });
        this.successMsg = data.message;
        this.showConfirmModal = false;
        await this.fetchLeaves();
        setTimeout(() => { this.successMsg = ''; }, 3000);
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update leave status.';
        this.showConfirmModal = false;
      } finally {
        this.updating = null;
      }
    },
    calcDays(start, end) {
      if (!start || !end) return 0;
      const diff = new Date(end) - new Date(start);
      return Math.max(1, Math.floor(diff / 86400000) + 1);
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    formatDateTime(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    leaveTypeEmoji(type) {
      const map = { sick: '🤒', casual: '☕', annual: '🏖️', other: '📋' };
      return map[type] || '📋';
    },
    statusBadge(status) {
      switch (status) {
        case 'Approved': return 'bg-green-100 text-green-700';
        case 'Rejected': return 'bg-red-100 text-red-700';
        default: return 'bg-yellow-100 text-yellow-700';
      }
    },
  },
};
</script>
