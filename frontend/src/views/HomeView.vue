<template>
  <!-- Central scrollable content -->
  <div class="flex flex-col w-full max-w-[600px] border-x border-neutral-800 h-screen overflow-hidden">
    <!-- Fixed header -->
    <div class="sticky top-0 z-10 bg-[#0e0f10] p-4 border-b border-neutral-800 flex items-center gap-3">
      <MobileMenuButton @toggle="$emit('toggleSidebar')"/>
      <h1 class="text-xl font-bold hidden sm:block">Home</h1>
      <div class="flex-1 lg:hidden">
        <SearchBar />
      </div>
    </div>
      
      <!-- Scrollable posts container -->
      <div class="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center p-20">
          <div class="text-center">
            <VueSpinnerOrbit :size="60" color="#22c55e" />
            <p class="text-neutral-500 mt-4">Loading posts...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center p-20">
          <div class="text-center">
            <p class="text-red-500 mb-4">{{ error }}</p>
            <button @click="fetchPosts" class="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-full font-bold">
              Try Again
            </button>
          </div>
        </div>

        <!-- Posts List -->
        <div v-else-if="posts.length">
          <Card 
            v-for="post in posts" 
            :key="post.id" 
            :post="post"
            :currentUserId="currentUserId"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="p-8 text-center text-neutral-500">
          <p class="text-lg mb-2">No posts yet</p>
          <p class="text-sm">Be the first to create a post!</p>
        </div>
      </div>

  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VueSpinnerOrbit } from 'vue3-spinners'
import Card from '@/components/Card.vue'
import MobileMenuButton from '@/components/MobileMenuButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import { postService } from '@/services/postService'
import { authService } from '@/services/auth'
import { getUserLikedPosts } from '@/services/likeService'

defineEmits(['toggleSidebar'])

const posts = ref([])
const currentUserId = ref<string>('')
const isLoading = ref(true)
const error = ref<string | null>(null)

// Format time helper
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Fetch posts from API
const fetchPosts = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Fetch current user
    try {
      const authResponse = await authService.getCurrentUser()
      currentUserId.value = authResponse.user._id || authResponse.user.id
    } catch (err) {
      // User not logged in
    }

    // Fetch posts and liked posts in parallel
    const [postsData, likedPostIds] = await Promise.all([
      postService.getPosts(),
      getUserLikedPosts().catch(() => []) // Fallback to empty array if not logged in
    ])
    
    // Create a Set for faster lookup
    const likedSet = new Set(likedPostIds)
    
    // Map posts to Card component format
    posts.value = postsData
      .filter((post: any) => !post.deleted) // Filter out deleted posts
      .map((post: any) => ({
      id: post._id,
      user: {
        id: post.author._id,
        name: post.author.displayName || post.author.username,
        handle: post.author.username,
        avatar: post.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username)}&background=random`
      },
      content: post.content,
      time: formatTimeAgo(post.createdAt),
      image: post.image || '',
      liked: likedSet.has(post._id),
      deleted: post.deleted || false,
      stats: {
        replies: post.stats?.replies || 0,
        reposts: post.stats?.forks || 0,
        likes: post.stats?.likes || 0
      }
    }))
  } catch (err: any) {
    console.error('Error fetching posts:', err)
    error.value = 'Failed to load posts. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}
</style>