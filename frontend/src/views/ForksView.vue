<template>
    <div class="flex flex-col w-full max-w-[600px] border-x border-neutral-800 h-screen overflow-hidden">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-[#0e0f10] p-4 border-b border-neutral-800 flex items-center">
        <button @click="goBack" class="mr-4">
          <ArrowLeft :size="20" />
        </button>
        <h1 class="text-xl font-bold">Post Thread</h1>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center p-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p class="text-neutral-500 mt-4">Loading thread...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center p-20">
        <div class="text-center">
          <p class="text-red-500 mb-4">{{ error }}</p>
          <button @click="fetchPostThread" class="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-full font-bold">
            Try Again
          </button>
        </div>
      </div>
        
      <!-- Thread visualization -->
      <div v-else class="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide space-y-4">
        <!-- Parent post (blue) -->
        <div v-if="parentPost" class="relative">
          <div class="text-xs text-neutral-500 mb-2 pl-6">Parent Post</div>
          <div class="relative pl-6">
            <div class="absolute left-0 top-0 h-full w-0.5 bg-blue-500 rounded-full"></div>
            <div class="bg-[#0e0f10] bg-opacity-70 backdrop-blur-sm rounded-xl border border-blue-500 border-opacity-30 p-4 shadow-lg">
              <Card :post="parentPost" :currentUserId="currentUserId" />
            </div>
          </div>
        </div>
        
        <!-- Current post (green) -->
        <div v-if="currentPost" class="relative">
          <div class="text-xs text-neutral-500 mb-2 pl-6">Current Post</div>
          <div class="relative pl-6">
            <div class="absolute left-0 top-0 h-full w-0.5 bg-green-500 rounded-full"></div>
            <div class="bg-[#0e0f10] bg-opacity-70 backdrop-blur-sm rounded-xl border border-green-500 border-opacity-30 p-4 shadow-lg">
              <Card :post="currentPost" :currentUserId="currentUserId" />
            </div>
          </div>
        </div>
        
        <!-- Child posts (neutral) -->
        <div v-if="childPosts.length" class="space-y-4 pl-8">
          <div class="text-xs text-neutral-500 mb-2 pl-6">Forked Posts ({{ childPosts.length }})</div>
          <div v-for="child in childPosts" :key="child.id" class="relative pl-6">
            <div class="absolute left-0 top-0 h-full w-0.5 bg-neutral-700 rounded-full"></div>
            <div class="bg-[#0e0f10] bg-opacity-70 backdrop-blur-sm rounded-xl border border-neutral-800 p-4 shadow-lg">
              <Card :post="child" :currentUserId="currentUserId" />
            </div>
          </div>
        </div>
        <div v-else-if="currentPost" class="p-8 text-center text-neutral-500">
          No forks yet. Be the first to fork this post!
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ArrowLeft } from 'lucide-vue-next'
  import Card from '@/components/Card.vue'
  import { postService } from '@/services/postService'
  import { authService } from '@/services/auth'
  import { getUserLikedPosts } from '@/services/likeService'

  const router = useRouter()
  const route = useRoute()

  const currentPost = ref<any>(null)
  const parentPost = ref<any>(null)
  const childPosts = ref<any[]>([])
  const currentUserId = ref<string>('')
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    return `${days}d`
  }

  const mapPostData = (postData: any, likedSet: Set<string>) => {
    return {
      id: postData._id,
      user: {
        id: postData.author._id,
        name: postData.author.displayName || postData.author.username,
        handle: postData.author.username,
        avatar: postData.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(postData.author.username)}&background=random`
      },
      content: postData.content,
      image: postData.image || '',
      time: formatTimeAgo(postData.createdAt),
      createdAt: postData.createdAt,
      liked: likedSet.has(postData._id),
      stats: {
        replies: postData.stats?.replies || 0,
        reposts: postData.stats?.forks || 0,
        likes: postData.stats?.likes || 0
      }
    }
  }

  const fetchPostThread = async () => {
    isLoading.value = true
    error.value = null

    try {
      const postId = route.params.id as string

      // Fetch current user
      let currentUserData = null
      try {
        const authResponse = await authService.getCurrentUser()
        currentUserData = authResponse.user
        currentUserId.value = authResponse.user._id || authResponse.user.id
      } catch (err) {
        // User not logged in
      }

      // Fetch liked posts
      const likedPostIds = currentUserData ? await getUserLikedPosts().catch(() => []) : []
      const likedSet = new Set(likedPostIds)

      // Fetch the current post
      const postData = await postService.getPost(postId)
      currentPost.value = mapPostData(postData, likedSet)

      // Fetch parent post if it exists (check for both 'parent' and 'forkedFrom')
      const parentId = postData.parent?._id || postData.parent
      if (parentId) {
        try {
          const parentData = await postService.getPost(parentId)
          parentPost.value = mapPostData(parentData, likedSet)
        } catch (err) {
          // Failed to fetch parent
        }
      }

      // Fetch child posts (posts that forked from this one)
      try {
        const childrenData = await postService.getPostForks(postId)
        childPosts.value = childrenData.map((child: any) => mapPostData(child, likedSet))
      } catch (err) {
        // Failed to fetch forks
        childPosts.value = []
      }

    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load post thread'
    } finally {
      isLoading.value = false
    }
  }

  const goBack = () => {
    router.go(-1)
  }

  onMounted(() => {
    fetchPostThread()
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
  
  /* Floating effect */
  .bg-opacity-70 {
    background-color: rgba(14, 15, 16, 0.7);
  }
  
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
  </style>
