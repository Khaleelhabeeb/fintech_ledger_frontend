<template>
  <div class="w-full">
    <!-- Table Container with horizontal scroll on mobile -->
    <div class="overflow-x-auto bg-white rounded-lg shadow-card -mx-4 sm:mx-0">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
        <!-- Table Header -->
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap',
                column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
              ]"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <span v-if="column.sortable" class="flex flex-col">
                  <svg
                    :class="[
                      'w-3 h-3',
                      sortKey === column.key && sortOrder === 'asc' ? 'text-accent' : 'text-gray-400'
                    ]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Loading State -->
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-6 py-12 text-center">
              <div class="flex justify-center items-center">
                <svg class="animate-spin h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </td>
          </tr>
          
          <!-- Empty State -->
          <tr v-else-if="!data || data.length === 0">
            <td :colspan="columns.length" class="px-6 py-12 text-center">
              <slot name="empty">
                <div class="text-gray-500">
                  <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p class="mt-2 text-sm">{{ emptyMessage }}</p>
                </div>
              </slot>
            </td>
          </tr>
          
          <!-- Data Rows -->
          <tr
            v-else
            v-for="(row, index) in data"
            :key="index"
            class="hover:bg-gray-50 transition-colors duration-150"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div
      v-if="pagination && data && data.length > 0"
      class="mt-4 flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          :disabled="pagination.page === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handlePageChange(pagination.page - 1)"
        >
          Previous
        </button>
        <button
          :disabled="pagination.page === pagination.totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handlePageChange(pagination.page + 1)"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (pagination.page - 1) * pagination.pageSize + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(pagination.page * pagination.pageSize, pagination.total) }}</span>
            of
            <span class="font-medium">{{ pagination.total }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              :disabled="pagination.page === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handlePageChange(pagination.page - 1)"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === pagination.page
                  ? 'z-10 bg-accent border-accent text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
              @click="handlePageChange(page)"
            >
              {{ page }}
            </button>
            
            <button
              :disabled="pagination.page === pagination.totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handlePageChange(pagination.page + 1)"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Column {
  key: string
  label: string
  sortable?: boolean
}

interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
  pagination?: Pagination
  emptyMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  emptyMessage: 'No data available'
})

const emit = defineEmits<{
  sort: [key: string, order: 'asc' | 'desc']
  'page-change': [page: number]
}>()

const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const visiblePages = computed(() => {
  if (!props.pagination) return []
  
  const { page, totalPages } = props.pagination
  const pages: number[] = []
  const maxVisible = 5
  
  let start = Math.max(1, page - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  
  emit('sort', key, sortOrder.value)
}

const handlePageChange = (page: number) => {
  if (props.pagination && page >= 1 && page <= props.pagination.totalPages) {
    emit('page-change', page)
  }
}
</script>
