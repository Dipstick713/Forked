<template>
    <div class="w-full max-w-[600px] border-x border-neutral-800 min-h-screen">
      <!-- Post Header -->
      <div class="sticky top-0 z-10 bg-[#0e0f10]/90 backdrop-blur-sm p-4 border-b border-neutral-800 flex items-center gap-4">
        <button @click="$router.back()" class="rounded-full p-2 hover:bg-neutral-800">
          <ArrowLeft :size="20" />
        </button>
        <h1 class="text-xl font-bold">Post</h1>
      </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center p-20">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p class="text-neutral-500 mt-4">Loading post...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center p-20">
          <div class="text-center">
            <p class="text-red-500 mb-4">{{ error }}</p>
            <button @click="fetchPost" class="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-full font-bold">
              Try Again
            </button>
          </div>
        </div>
  
        <div v-else>
          <!-- Main Post -->
          <div class="p-4 border-b border-neutral-800">
            <div class="flex gap-3">
              <img 
                :src="post.user.avatar" 
                class="w-12 h-12 rounded-full object-cover border border-neutral-700 cursor-pointer hover:opacity-90 transition"
                alt="User avatar"
                @click="goToProfile(post.user.handle)"
              >
              <div class="flex-1">
                <div class="flex items-center gap-1">
                  <span 
                    class="font-bold cursor-pointer hover:underline"
                    @click="goToProfile(post.user.handle)"
                  >{{ post.user.name }}</span>
                  <span 
                    class="text-neutral-500 cursor-pointer hover:underline"
                    @click="goToProfile(post.user.handle)"
                  >@{{ post.user.handle }}</span>
                </div>
                <p class="mt-3 text-white text-lg">{{ post.content }}</p>
                
                <!-- Image (optional) -->
                <img 
                  v-if="post.image" 
                  :src="post.image" 
                  class="mt-3 rounded-xl border border-neutral-800 max-h-96 w-full object-cover"
                >

                <!-- Timestamp -->
                <div class="mt-3 text-neutral-500 text-sm">
                  {{ formatFullDate(post.createdAt) }}
                </div>
                
                <!-- Stats -->
                <div class="flex gap-4 mt-3 py-3 border-y border-neutral-800 text-sm">
                  <div><span class="font-bold text-white">{{ post.stats.forks }}</span> <span class="text-neutral-500">Forks</span></div>
                  <div><span class="font-bold text-white">{{ post.stats.likes }}</span> <span class="text-neutral-500">Likes</span></div>
                </div>

                <!-- Actions -->
                <div class="flex justify-between mt-3 text-neutral-500 max-w-md">
                  <!-- Fork -->
                  <button 
                    class="flex items-center gap-1 hover:text-green-500 group"
                    @click="goToFork"
                  >
                    <div class="p-2 rounded-full group-hover:bg-green-500/10">
                      <GitBranch class="size-5"/>
                    </div>
                  </button>

                  <!-- Like -->
                  <button 
                    class="flex items-center gap-1 group"
                    :class="post.liked ? 'text-pink-500' : 'hover:text-pink-500'"
                    @click="toggleLike"
                  >
                    <div class="p-2 rounded-full group-hover:bg-pink-500/10">
                      <Heart :class="post.liked ? 'fill-current' : ''" class="size-5"/>
                    </div>
                  </button>

                  <!-- Share -->
                  <button 
                    class="flex items-center gap-1 group relative"
                    :class="copied ? 'text-green-500' : 'hover:text-blue-400'"
                    @click="copyPostLink"
                  >
                    <div class="p-2 rounded-full group-hover:bg-blue-400/10">
                      <Check v-if="copied" class="size-5"/>
                      <Share v-else class="size-5"/>
                    </div>
                    <span v-if="copied" class="text-xs text-green-500">Copied!</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { GitBranch, Heart, Share, ArrowLeft, Check } from 'lucide-vue-next'
  import { postService } from '@/services/postService'
  import { authService } from '@/services/auth'
  import { likePost, unlikePost, getUserLikedPosts } from '@/services/likeService'

  const route = useRoute()
  const router = useRouter()

  const post = ref<any>(null)
  const currentUser = ref<any>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  const copied = ref(false)

  // Format full date
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const goToProfile = (handle: string) => {
    router.push(`/${handle}`)
  }

  const goToFork = () => {
    if (post.value) {
      router.push(`/fork/${post.value.id}`)
    }
  }

  const fetchPost = async () => {
    isLoading.value = true
    error.value = null

    try {
      const postId = route.params.id as string
      
      // Fetch current user
      try {
        const authResponse = await authService.getCurrentUser()
        currentUser.value = {
          avatar: authResponse.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authResponse.user.username)}&background=random`
        }
      } catch (err) {
        // User not logged in
        currentUser.value = null
      }

      // Fetch post and liked posts in parallel
      const [postData, likedPostIds] = await Promise.all([
        postService.getPost(postId),
        currentUser.value ? getUserLikedPosts().catch(() => []) : Promise.resolve([])
      ])

      const likedSet = new Set(likedPostIds)

      // Map post data
      post.value = {
        id: postData._id,
        user: {
          id: postData.author._id,
          name: postData.author.displayName || postData.author.username,
          handle: postData.author.username,
          avatar: postData.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(postData.author.username)}&background=random`
        },
        content: postData.content,
        image: postData.image || '',
        createdAt: postData.createdAt,
        liked: likedSet.has(postData._id),
        stats: {
          replies: postData.stats?.replies || 0,
          forks: postData.stats?.forks || 0,
          likes: postData.stats?.likes || 0
        }
      }

    } catch (err: any) {
      console.error('Error fetching post:', err)
      error.value = err.response?.data?.message || 'Failed to load post'
    } finally {
      isLoading.value = false
    }
  }

  const toggleLike = async () => {
    if (!currentUser.value) {
      window.location.href = 'http://localhost:3000/auth/github'
      return
    }

    try {
      if (post.value.liked) {
        const result = await unlikePost(post.value.id)
        post.value.liked = false
        post.value.stats.likes = result.likes
      } else {
        const result = await likePost(post.value.id)
        post.value.liked = true
        post.value.stats.likes = result.likes
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const copyPostLink = async () => {
    try {
      const postUrl = `${window.location.origin}/post/${post.value.id}`
      await navigator.clipboard.writeText(postUrl)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (error) {
      console.error('Error copying link:', error)
    }
  }

  onMounted(() => {
    fetchPost()
  })
</script>