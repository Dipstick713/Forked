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
                  <div><span class="font-bold text-white">{{ post.stats.replies }}</span> <span class="text-neutral-500">Replies</span></div>
                  <div><span class="font-bold text-white">{{ post.stats.forks }}</span> <span class="text-neutral-500">Forks</span></div>
                  <div><span class="font-bold text-white">{{ post.stats.likes }}</span> <span class="text-neutral-500">Likes</span></div>
                </div>

                <!-- Actions -->
                <div class="flex justify-between mt-3 text-neutral-500 max-w-md">
                  <!-- Reply -->
                  <button class="flex items-center gap-1 hover:text-blue-400 group">
                    <div class="p-2 rounded-full group-hover:bg-blue-400/10">
                      <MessageCircle class="size-5"/>
                    </div>
                  </button>

                  <!-- Fork -->
                  <button class="flex items-center gap-1 hover:text-green-500 group">
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
                  <button class="flex items-center gap-1 hover:text-blue-400 group">
                    <div class="p-2 rounded-full group-hover:bg-blue-400/10">
                      <Share class="size-5"/>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
    
          <!-- Reply Composition -->
          <div v-if="currentUser" class="p-4 border-b border-neutral-800">
            <div class="flex gap-3">
              <img 
                :src="currentUser.avatar" 
                class="w-10 h-10 rounded-full object-cover border border-neutral-700"
                alt="User avatar"
              >
              <div class="flex-1">
                <textarea
                  ref="textarea"
                  v-model="replyText"
                  placeholder="Post your reply..."
                  class="w-full bg-transparent outline-none text-white placeholder-neutral-500 resize-none overflow-hidden min-h-[1lh] max-h-[200px]"
                  rows="1"
                  @input="adjustTextareaHeight"
                  @keydown="handleKeyDown"
                  style="line-height: 1.5;"
                ></textarea>
                
                <div v-if="replyText" class="flex justify-between items-center mt-2">
                  <span class="text-sm text-neutral-500">{{ replyText.length }}/280</span>
                  <button 
                    :disabled="isPosting || replyText.length === 0 || replyText.length > 280"
                    class="bg-green-500 hover:bg-green-600 text-black px-4 py-1.5 rounded-full font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="postReply"
                  >
                    {{ isPosting ? 'Posting...' : 'Reply' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Replies -->
          <div v-if="isLoadingReplies" class="flex items-center justify-center p-10">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p class="text-neutral-500 mt-2 text-sm">Loading replies...</p>
            </div>
          </div>

          <div v-else-if="replies.length > 0" class="divide-y divide-neutral-800">
            <div v-for="reply in replies" :key="reply.id" class="p-4 hover:bg-neutral-900/50 transition cursor-pointer">
              <div class="flex gap-3">
                <img 
                  :src="reply.user.avatar" 
                  class="w-10 h-10 rounded-full object-cover border border-neutral-700 cursor-pointer hover:opacity-90 transition"
                  alt="User avatar"
                  @click="goToProfile(reply.user.handle)"
                >
                <div class="flex-1">
                  <div class="flex items-center gap-1 text-sm">
                    <span 
                      class="font-bold cursor-pointer hover:underline"
                      @click="goToProfile(reply.user.handle)"
                    >{{ reply.user.name }}</span>
                    <span 
                      class="text-neutral-500 cursor-pointer hover:underline"
                      @click="goToProfile(reply.user.handle)"
                    >@{{ reply.user.handle }}</span>
                    <span class="text-neutral-500">·</span>
                    <span class="text-neutral-500">{{ reply.time }}</span>
                  </div>
                  <p class="mt-1 text-white text-sm">{{ reply.content }}</p>
                  
                  <!-- Reply Image -->
                  <img 
                    v-if="reply.image" 
                    :src="reply.image" 
                    class="mt-3 rounded-xl border border-neutral-800 max-h-64 w-full object-cover"
                  >
                </div>
              </div>
            </div>
          </div>

          <div v-else class="p-8 text-center text-neutral-500">
            <p>No replies yet</p>
            <p class="text-sm mt-1">Be the first to reply!</p>
          </div>
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, nextTick, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { GitBranch, MessageCircle, Heart, Share, ArrowLeft } from 'lucide-vue-next'
  import { postService } from '@/services/postService'
  import { authService } from '@/services/auth'
  import { likePost, unlikePost, getUserLikedPosts } from '@/services/likeService'

  const route = useRoute()
  const router = useRouter()

  const post = ref<any>(null)
  const replies = ref<any[]>([])
  const currentUser = ref<any>(null)
  const isLoading = ref(true)
  const isLoadingReplies = ref(false)
  const isPosting = ref(false)
  const error = ref<string | null>(null)
  const replyText = ref('')
  const textarea = ref<HTMLTextAreaElement | null>(null)

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

  const adjustTextareaHeight = () => {
    if (!textarea.value) return
    
    nextTick(() => {
      try {
        textarea.value!.style.height = 'auto'
        const lineHeight = parseInt(window.getComputedStyle(textarea.value!).lineHeight) || 24
        textarea.value!.style.height = `${Math.max(textarea.value!.scrollHeight, lineHeight)}px`
      } catch (error) {
        console.error('Error adjusting textarea height:', error)
      }
    })
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      postReply()
    }
  }

  const goToProfile = (handle: string) => {
    router.push(`/${handle}`)
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

      // Fetch replies
      await fetchReplies(likedSet)

    } catch (err: any) {
      console.error('Error fetching post:', err)
      error.value = err.response?.data?.message || 'Failed to load post'
    } finally {
      isLoading.value = false
    }
  }

  const fetchReplies = async (likedSet?: Set<string>) => {
    isLoadingReplies.value = true

    try {
      const postId = route.params.id as string
      const repliesData = await postService.getPostReplies(postId)

      // Get liked set if not provided
      if (!likedSet && currentUser.value) {
        const likedPostIds = await getUserLikedPosts().catch(() => [])
        likedSet = new Set(likedPostIds)
      } else if (!likedSet) {
        likedSet = new Set()
      }

      replies.value = repliesData.map((reply: any) => ({
        id: reply._id,
        user: {
          id: reply.author._id,
          name: reply.author.displayName || reply.author.username,
          handle: reply.author.username,
          avatar: reply.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author.username)}&background=random`
        },
        content: reply.content,
        image: reply.image || '',
        time: formatTimeAgo(reply.createdAt),
        liked: likedSet.has(reply._id)
      }))
    } catch (err) {
      console.error('Error fetching replies:', err)
    } finally {
      isLoadingReplies.value = false
    }
  }

  const postReply = async () => {
    if (!replyText.value.trim() || isPosting.value) return

    if (!currentUser.value) {
      window.location.href = 'http://localhost:3000/auth/github'
      return
    }

    isPosting.value = true

    try {
      const postId = route.params.id as string
      await postService.createPost({
        content: replyText.value,
        parentId: postId
      })

      // Clear reply text
      replyText.value = ''
      if (textarea.value) {
        textarea.value.style.height = 'auto'
      }

      // Refresh replies
      await fetchReplies()

      // Update reply count
      if (post.value) {
        post.value.stats.replies++
      }
    } catch (err: any) {
      console.error('Error posting reply:', err)
      alert(err.response?.data?.message || 'Failed to post reply')
    } finally {
      isPosting.value = false
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

  onMounted(() => {
    fetchPost()
  })
</script>