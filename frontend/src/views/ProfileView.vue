<template>
    <div class="w-full max-w-[600px] border-x border-neutral-800 flex flex-col h-screen overflow-hidden">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-[#0e0f10]/90 backdrop-blur-sm p-4 border-b border-neutral-800 flex items-center gap-6">
        <button @click="$router.back()" class="rounded-full p-2 hover:bg-neutral-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
          <div>
            <h1 class="text-xl font-bold">{{ user.name || 'Loading...' }}</h1>
            <p class="text-sm text-neutral-500">{{ posts.length }} posts</p>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center p-20">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p class="text-neutral-500 mt-4">Loading profile...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center p-20">
          <div class="text-center">
            <p class="text-red-500 mb-4">{{ error }}</p>
            <button @click="fetchUserData" class="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-full font-bold">
              Try Again
            </button>
          </div>
        </div>
        
        <div v-else class="flex-1 overflow-y-auto scrollbar-hide">
        <!-- Cover Photo -->
        <div class="h-48 bg-neutral-800 relative">
          <img 
            v-if="user.coverPhoto" 
            :src="user.coverPhoto" 
            class="w-full h-full object-cover"
            alt="Cover photo"
          >
        </div>
  
        <!-- Profile Info -->
        <div class="px-4 pb-4 relative">
          <!-- Avatar -->
          <div class="absolute -top-20 left-4 border-4 border-[#0e0f10] rounded-full">
            <img 
              :src="user.avatar" 
              class="w-32 h-32 rounded-full object-cover"
              alt="Profile picture"
            >
          </div>
  
          <!-- Follow Button -->
          <div class="flex justify-end mt-4">
            <button 
              v-if="!isOwnProfile && currentUser"
              @click="toggleFollow"
              :disabled="isFollowLoading"
              :class="{
                'bg-white border border-black text-black': isFollowing,
                'bg-transparent border border-neutral-600 text-white': !isFollowing,
                'opacity-50 cursor-not-allowed': isFollowLoading
              }"
              class="px-4 py-1.5 rounded-full font-bold hover:opacity-90 transition"
            >
              <span v-if="!isFollowLoading">{{ isFollowing ? 'Following' : 'Follow' }}</span>
              <span v-else>Loading...</span>
            </button>
            <button 
              v-else-if="isOwnProfile"
              @click="showEditModal = true"
              class="px-4 py-1.5 bg-transparent border border-neutral-600 text-white rounded-full font-bold hover:bg-neutral-800 transition"
            >
              Edit Profile
            </button>
          </div>

          <!-- Edit Profile Modal -->
          <div 
            v-if="showEditModal" 
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            @click.self="showEditModal = false"
          >
            <div class="bg-[#0e0f10] border border-neutral-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <!-- Modal Header -->
              <div class="sticky top-0 bg-[#0e0f10] border-b border-neutral-800 p-4 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <button 
                    @click="showEditModal = false"
                    class="rounded-full p-2 hover:bg-neutral-800 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h2 class="text-xl font-bold">Edit Profile</h2>
                </div>
                <button 
                  @click="saveProfile"
                  :disabled="isSaving"
                  class="bg-green-500 hover:bg-green-600 text-black px-4 py-1.5 rounded-full font-bold disabled:opacity-50 transition"
                >
                  {{ isSaving ? 'Saving...' : 'Save' }}
                </button>
              </div>

              <!-- Modal Body -->
              <div class="p-4 space-y-6">
                <!-- Cover Photo Section -->
                <div class="relative h-48 bg-neutral-800 rounded-lg overflow-hidden group cursor-pointer">
                  <img 
                    v-if="editForm.coverPhoto" 
                    :src="editForm.coverPhoto" 
                    class="w-full h-full object-cover"
                    alt="Cover photo"
                  >
                  <div v-if="!editForm.coverPhoto" class="w-full h-full flex items-center justify-center text-neutral-500">
                    <span class="text-sm">No cover photo</span>
                  </div>
                  <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div class="bg-neutral-800/80 backdrop-blur-sm rounded-full p-3 hover:bg-neutral-700/80 transition">
                      <Camera :size="24" />
                    </div>
                  </div>
                </div>

                <!-- Avatar Section -->
                <div class="relative -mt-20 ml-4 w-32 h-32">
                  <div class="relative w-full h-full rounded-full border-4 border-[#0e0f10] bg-neutral-800 overflow-hidden group cursor-pointer">
                    <img 
                      :src="editForm.avatar" 
                      class="w-full h-full object-cover"
                      alt="Profile picture"
                    >
                    <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div class="bg-neutral-800/80 backdrop-blur-sm rounded-full p-2 hover:bg-neutral-700/80 transition">
                        <Camera :size="20" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Form Fields -->
                <div class="space-y-4 mt-4">
                  <!-- Name -->
                  <div>
                    <label class="block text-sm text-neutral-400 mb-2">Name</label>
                    <input 
                      v-model="editForm.name"
                      type="text"
                      maxlength="50"
                      class="w-full bg-transparent border border-neutral-700 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition"
                      placeholder="Your name"
                    >
                    <p class="text-xs text-neutral-500 mt-1">{{ editForm.name.length }}/50</p>
                  </div>

                  <!-- Bio -->
                  <div>
                    <label class="block text-sm text-neutral-400 mb-2">Bio</label>
                    <textarea 
                      v-model="editForm.bio"
                      maxlength="160"
                      rows="3"
                      class="w-full bg-transparent border border-neutral-700 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition resize-none"
                      placeholder="Tell us about yourself"
                    ></textarea>
                    <p class="text-xs text-neutral-500 mt-1">{{ editForm.bio.length }}/160</p>
                  </div>

                  <!-- Location -->
                  <div>
                    <label class="block text-sm text-neutral-400 mb-2">Location</label>
                    <input 
                      v-model="editForm.location"
                      type="text"
                      maxlength="30"
                      class="w-full bg-transparent border border-neutral-700 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition"
                      placeholder="Where are you based?"
                    >
                  </div>

                  <!-- Website -->
                  <div>
                    <label class="block text-sm text-neutral-400 mb-2">Website</label>
                    <input 
                      v-model="editForm.website"
                      type="url"
                      class="w-full bg-transparent border border-neutral-700 rounded-lg px-4 py-3 focus:border-green-500 focus:outline-none transition"
                      placeholder="https://example.com"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- User Info -->
          <div class="mt-6">
            <h1 class="text-xl font-bold">{{ user.name }}</h1>
            <p class="text-neutral-500">@{{ user.handle }}</p>
            <p class="mt-3">{{ user.bio }}</p>
            
            <div class="flex gap-4 mt-3 text-neutral-500 text-sm">
              <div v-if="user.location" class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ user.location }}</span>
              </div>
              <div v-if="user.website" class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <a :href="user.website" target="_blank" class="text-green-500 hover:underline">{{ user.website.replace('https://github.com/', '@') }}</a>
              </div>
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Joined {{ user.joinDate }}</span>
              </div>
            </div>
  
            <div class="flex gap-5 mt-3">
              <router-link 
                :to="`/${user.handle}/following`" 
                class="hover:underline"
              >
                <span class="font-bold text-white">{{ user.followingCount }}</span>
                <span class="text-neutral-500"> Following</span>
              </router-link>
              <router-link 
                :to="`/${user.handle}/followers`" 
                class="hover:underline"
              >
                <span class="font-bold text-white">{{ user.followersCount }}</span>
                <span class="text-neutral-500"> Followers</span>
              </router-link>
            </div>
          </div>
        </div>
  
        <!-- Tabs -->
        <div class="flex border-b border-neutral-800 mt-4">
          <button 
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="{
              'font-bold text-white': activeTab === tab,
              'text-neutral-500': activeTab !== tab
            }"
            class="flex-1 py-4 hover:bg-neutral-900/50 transition relative"
          >
            {{ tab }}
            <div 
              v-if="activeTab === tab"
              class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-12 bg-green-500 rounded-full"
            ></div>
          </button>
        </div>
  
        <!-- Posts -->
        <div v-if="activeTab === 'Posts'">
          <div v-if="posts.length > 0">
            <PostCard 
              v-for="post in posts" 
              :key="post.id" 
              :post="post"
            />
          </div>
          <div v-else class="p-8 text-center text-neutral-500">
            <p>No posts yet</p>
          </div>
        </div>
  
        <!-- Likes -->
        <div v-if="activeTab === 'Likes'">
          <!-- Loading State -->
          <div v-if="isLoadingLikes" class="flex items-center justify-center p-20">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
              <p class="text-neutral-500 mt-4">Loading liked posts...</p>
            </div>
          </div>

          <!-- Liked Posts -->
          <div v-else-if="likedPosts.length > 0">
            <PostCard 
              v-for="post in likedPosts" 
              :key="post.id" 
              :post="post"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="p-8 text-center text-neutral-500">
            <p class="text-lg mb-2">No liked posts yet</p>
            <p class="text-sm">Posts liked by @{{ user.handle }} will appear here</p>
          </div>
        </div>
       </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { Camera } from 'lucide-vue-next'
  import PostCard from '@/components/Card.vue'
  import { userService } from '@/services/userService'
  import { authService } from '@/services/auth'
  import { followService } from '@/services/followService'
  import { getUserLikedPosts, getUserLikedPostsWithDetails } from '@/services/likeService'
  
  const route = useRoute()
  const activeTab = ref<string>('Posts')
  const tabs = ['Posts', 'Likes']
  const isFollowing = ref(false)
  const isLoading = ref(true)
  const isFollowLoading = ref(false)
  const error = ref<string | null>(null)
  const currentUser = ref<any>(null)
  const showEditModal = ref(false)
  const isSaving = ref(false)
  
  const user = ref({
    _id: '',
    name: '',
    handle: '',
    avatar: '',
    coverPhoto: '',
    bio: '',
    location: '',
    website: '',
    joinDate: '',
    followersCount: 0,
    followingCount: 0
  })

  const editForm = ref({
    name: '',
    bio: '',
    location: '',
    website: '',
    avatar: '',
    coverPhoto: ''
  })
  
  const posts = ref([])
  const likedPosts = ref([])
  const isLoadingLikes = ref(false)

  // Check if viewing own profile
  const isOwnProfile = computed(() => {
    return currentUser.value && user.value._id === currentUser.value.id
  })

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  // Format time helper for posts
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return formatDate(dateString)
  }

  // Fetch user data
  const fetchUserData = async () => {
    try {
      isLoading.value = true
      error.value = null

      // Fetch user data
      const authResponse = await authService.getCurrentUser()
      currentUser.value = authResponse.user

      // Get username from route params
      const username = route.params.user as string

      let userData
      if (username) {
        // Fetch user by username from route
        userData = await userService.getUserByUsername(username)
      } else if (currentUser.value) {
        // If no username in route, show current user's profile
        userData = await userService.getUserById(currentUser.value.id)
      } else {
        error.value = 'Please log in to view profiles'
        return
      }

      // Map backend data to frontend format
      user.value = {
        _id: userData._id,
        name: userData.displayName || userData.username,
        handle: userData.username,
        avatar: userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=random`,
        coverPhoto: '',
        bio: userData.bio || '',
        location: '',
        website: userData.profileUrl || '',
        joinDate: userData.createdAt ? formatDate(userData.createdAt) : 'Recently',
        followersCount: userData.followersCount || 0,
        followingCount: userData.followingCount || 0
      }

      // Populate edit form if viewing own profile
      if (isOwnProfile.value) {
        editForm.value = {
          name: user.value.name,
          bio: user.value.bio,
          location: user.value.location,
          website: user.value.website,
          avatar: user.value.avatar,
          coverPhoto: user.value.coverPhoto
        }
      }

      // Check if following this user (only if viewing another user's profile)
      if (currentUser.value && userData._id !== currentUser.value.id) {
        try {
          const followStatus = await followService.checkFollowStatus(userData._id)
          isFollowing.value = followStatus.isFollowing
        } catch (err) {
          console.error('Error checking follow status:', err)
        }
      }

      // Fetch user's posts and liked posts in parallel
      const [userPosts, likedPostIds] = await Promise.all([
        userService.getUserPosts(userData._id),
        currentUser.value ? getUserLikedPosts().catch(() => []) : Promise.resolve([])
      ])
      
      // Create a Set for faster lookup
      const likedSet = new Set(likedPostIds)
      
      // Map posts to Card component format
      posts.value = userPosts.map((post: any) => ({
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
        stats: {
          replies: post.stats?.replies || 0,
          reposts: post.stats?.forks || 0,
          likes: post.stats?.likes || 0
        }
      }))

    } catch (err: any) {
      console.error('Error fetching user data:', err)
      error.value = err.response?.data?.message || 'Failed to load user profile'
    } finally {
      isLoading.value = false
    }
  }

  // Fetch liked posts
  const fetchLikedPosts = async () => {
    if (!user.value._id) return

    isLoadingLikes.value = true
    
    try {
      const likesData = await getUserLikedPostsWithDetails(user.value._id)
      
      // Get current user's liked post IDs for marking
      const likedPostIds = currentUser.value 
        ? await getUserLikedPosts().catch(() => []) 
        : []
      const likedSet = new Set(likedPostIds)
      
      // Map liked posts to Card component format
      likedPosts.value = likesData
        .filter((like: any) => like.post) // Filter out any likes where post was deleted
        .map((like: any) => ({
          id: like.post._id,
          user: {
            id: like.post.author._id,
            name: like.post.author.displayName || like.post.author.username,
            handle: like.post.author.username,
            avatar: like.post.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(like.post.author.username)}&background=random`
          },
          content: like.post.content,
          time: formatTimeAgo(like.post.createdAt),
          image: like.post.image || '',
          liked: likedSet.has(like.post._id),
          stats: {
            replies: like.post.stats?.replies || 0,
            reposts: like.post.stats?.forks || 0,
            likes: like.post.stats?.likes || 0
          }
        }))
    } catch (err: any) {
      console.error('Error fetching liked posts:', err)
    } finally {
      isLoadingLikes.value = false
    }
  }

  // Watch for tab changes to load liked posts when needed
  watch(activeTab, (newTab) => {
    if (newTab === 'Likes' && likedPosts.value.length === 0) {
      fetchLikedPosts()
    }
  })

  onMounted(() => {
    fetchUserData()
    
    // Add keyboard event listener for Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showEditModal.value) {
        showEditModal.value = false
      }
    }
    window.addEventListener('keydown', handleEscape)
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  })

  // Watch for modal open to populate form
  watch(showEditModal, (isOpen) => {
    if (isOpen && isOwnProfile.value) {
      editForm.value = {
        name: user.value.name,
        bio: user.value.bio,
        location: user.value.location,
        website: user.value.website,
        avatar: user.value.avatar,
        coverPhoto: user.value.coverPhoto
      }
    }
  })
  
  const toggleFollow = async () => {
    if (!currentUser.value) {
      // Redirect to login
      window.location.href = 'http://localhost:3000/auth/github'
      return
    }

    if (isOwnProfile.value) return

    isFollowLoading.value = true

    try {
      if (isFollowing.value) {
        await followService.unfollowUser(user.value._id)
        isFollowing.value = false
        user.value.followersCount = Math.max(0, user.value.followersCount - 1)
      } else {
        await followService.followUser(user.value._id)
        isFollowing.value = true
        user.value.followersCount++
      }
    } catch (err: any) {
      console.error('Error toggling follow:', err)
      error.value = 'Failed to update follow status'
    } finally {
      isFollowLoading.value = false
    }
  }

  const saveProfile = async () => {
    if (!currentUser.value) return

    isSaving.value = true
    error.value = null

    try {
      // Update user profile via API
      const updatedData = await userService.updateProfile({
        displayName: editForm.value.name,
        bio: editForm.value.bio,
        location: editForm.value.location,
        website: editForm.value.website
      })

      // Update local user data
      user.value.name = editForm.value.name
      user.value.bio = editForm.value.bio
      user.value.location = editForm.value.location
      user.value.website = editForm.value.website

      // Close modal
      showEditModal.value = false
      
      console.log('Profile updated successfully')
    } catch (err: any) {
      console.error('Error updating profile:', err)
      error.value = 'Failed to update profile'
    } finally {
      isSaving.value = false
    }
  }

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