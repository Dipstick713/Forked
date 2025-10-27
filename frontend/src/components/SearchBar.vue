<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X } from 'lucide-vue-next'
import { VueSpinnerDots } from 'vue3-spinners'
import { userService } from '@/services/userService'

type User = {
  _id: string
  username: string
  displayName?: string
  avatarUrl: string
  bio?: string
}

const router = useRouter()
const searchQuery = ref('')
const isFocused = ref(false)
const isLoading = ref(false)
const searchResults = ref<User[]>([])

// Debounce timer
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Search users function
const searchUsers = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  
  try {
    const users = await userService.searchUsers(query)
    searchResults.value = users
  } catch (error) {
    console.error('Error searching users:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const goToProfile = (username: string) => {
  router.push(`/${username}`)
  clearSearch()
  isFocused.value = false
}

// Debounce search input
watch(searchQuery, (newQuery) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = setTimeout(() => {
    searchUsers(newQuery)
  }, 300)
})
</script>

<template>
  <div class="relative w-full max-w-lg mx-auto">
    <!-- Search Input -->
    <div class="relative ">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search class="h-5 w-5 text-neutral-500" />
      </div>
      <input
        v-model="searchQuery"
        @focus="isFocused = true"
        @blur="setTimeout(() => isFocused = false, 200)"
        type="text"
        placeholder="Search users..."
        class="block w-full pl-10 pr-12 py-2 bg-[#15181b] border border-[#494b5e] rounded-full text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition"
      >
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <X class="h-5 w-5 text-neutral-500 hover:text-white transition" />
      </button>
    </div>

    <!-- Search Results Dropdown -->
    <div
      v-if="isFocused && (searchQuery || searchResults.length)"
      class="absolute z-10 mt-2 w-full bg-[#15181b] border border-neutral-800 rounded-xl shadow-lg overflow-hidden"
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="p-4 flex justify-center">
        <VueSpinnerDots :size="40" color="#22c55e" />
      </div>

      <!-- No Results -->
      <div v-else-if="searchResults.length === 0 && searchQuery" class="p-4 text-center text-neutral-500">
        No users found
      </div>

      <!-- Results List -->
      <ul v-else class="divide-y divide-neutral-800 max-h-96 overflow-y-auto">
        <li
          v-for="user in searchResults"
          :key="user._id"
          @click="goToProfile(user.username)"
          class="p-3 hover:bg-[#1e2124] transition cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <img
              :src="user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`"
              class="h-10 w-10 rounded-full object-cover border border-neutral-700"
              :alt="user.displayName || user.username"
            >
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-1">
                <p class="font-medium text-white truncate">{{ user.displayName || user.username }}</p>
              </div>
              <p class="text-sm text-neutral-500 truncate">@{{ user.username }}</p>
              <p v-if="user.bio" class="text-sm text-neutral-400 mt-1 truncate">{{ user.bio }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for results */
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-track {
  background: #1e1e1e;
}
ul::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 3px;
}
ul::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>