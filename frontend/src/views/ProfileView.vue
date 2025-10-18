<template>
    <div class="flex justify-center bg-[#0e0f10] text-white min-h-screen">
      <Sidebar/>
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
              class="px-4 py-1.5 bg-transparent border border-neutral-600 text-white rounded-full font-bold hover:bg-neutral-800 transition"
            >
              Edit Profile
            </button>
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
        <div v-if="activeTab === 'Likes'" class="p-8 text-center text-neutral-500">
          No likes yet
        </div>
       </div>
      </div>
      <RightPanel/>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import Sidebar from '@/components/Sidebar.vue'
  import RightPanel from '@/components/RightPanel.vue'
  import PostCard from '@/components/Card.vue'
  import { userService } from '@/services/userService'
  import { authService } from '@/services/auth'
  import { followService } from '@/services/followService'
  
  const route = useRoute()
  const activeTab = ref<string>('Posts')
  const tabs = ['Posts', 'Likes']
  const isFollowing = ref(false)
  const isLoading = ref(true)
  const isFollowLoading = ref(false)
  const error = ref<string | null>(null)
  const currentUser = ref<any>(null)
  
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
  
  const posts = ref([])

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

      // Check if following this user (only if viewing another user's profile)
      if (currentUser.value && userData._id !== currentUser.value.id) {
        try {
          const followStatus = await followService.checkFollowStatus(userData._id)
          isFollowing.value = followStatus.isFollowing
        } catch (err) {
          console.error('Error checking follow status:', err)
        }
      }

      // Fetch user's posts
      const userPosts = await userService.getUserPosts(userData._id)
      
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
        liked: false,
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

  onMounted(() => {
    fetchUserData()
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