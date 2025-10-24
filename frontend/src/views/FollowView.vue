<template>
  <div class="w-full max-w-[600px] border-x border-neutral-800 flex flex-col h-screen overflow-hidden">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-[#0e0f10]/90 backdrop-blur-sm p-4 border-b border-neutral-800">
      <div class="flex items-center gap-6">
        <button @click="$router.back()" class="rounded-full p-2 hover:bg-neutral-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          </button>
          <div>
            <h1 class="text-xl font-bold">{{ activeTab === 'followers' ? 'Followers' : 'Following' }}</h1>
            <p class="text-sm text-neutral-500">@{{ user.handle }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-neutral-800">
        <button 
          v-for="tab in tabs"
          :key="tab.value"
          @click="switchTab(tab.value)"
          :class="{
            'font-bold text-white': activeTab === tab.value,
            'text-neutral-500': activeTab !== tab.value
          }"
          
          class="flex-1 py-4 hover:bg-neutral-900/50 transition relative"
        >
          {{ tab.label }}
          <div 
            v-if="activeTab === tab.value"
            class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-12 bg-green-500 rounded-full"
          ></div>
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto scrollbar-hide">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center p-20">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p class="text-neutral-500 mt-4">Loading...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center p-20">
          <div class="text-center">
            <p class="text-red-500 mb-4">{{ error }}</p>
            <button @click="fetchFollowData" class="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-full font-bold">
              Try Again
            </button>
          </div>
        </div>

        <!-- Followers Tab Content -->
        <div v-else-if="activeTab === 'followers'">
          <div v-if="followers.length === 0" class="p-8 text-center text-neutral-500">
            <p>No followers yet</p>
          </div>
          <div
            v-else
            class="divide-y divide-neutral-800"
          >
            <div
              v-for="followerUser in followers"
              :key="followerUser.id"
              class="p-4 hover:bg-[#1e2124] transition cursor-pointer"
            >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <router-link :to="`/${followerUser.handle}`">
                  <img 
                    :src="followerUser.avatar" 
                    class="w-12 h-12 rounded-full object-cover border border-neutral-700"
                    :alt="followerUser.name"
                  >
                </router-link>
                <div class="flex-1 min-w-0">
                  <router-link :to="`/${followerUser.handle}`">
                    <h3 class="font-bold truncate hover:underline">{{ followerUser.name }}</h3>
                  </router-link>
                  <p class="text-neutral-500 text-sm truncate">@{{ followerUser.handle }}</p>
                  <p v-if="followerUser.bio" class="text-neutral-400 text-sm mt-1 truncate">{{ followerUser.bio }}</p>
                  <p v-if="followerUser.followsYou" class="text-neutral-500 text-xs mt-1">Follows you</p>
                </div>
              </div>
              <button 
                @click="toggleFollow(followerUser, 'followers')"
                :class="{
                  'bg-white text-black': followerUser.isFollowing,
                  'bg-transparent border border-neutral-600 text-white': !followerUser.isFollowing
                }"
                class="px-4 py-1.5 rounded-full text-sm font-bold hover:opacity-90 transition whitespace-nowrap"
              >
                {{ followerUser.isFollowing ? 'Following' : 'Follow' }}
              </button>
            </div>
          </div>
          </div>
        </div>

        <!-- Following Tab Content -->
        <div v-else-if="activeTab === 'following'">
          <div v-if="following.length === 0" class="p-8 text-center text-neutral-500">
            <p>Not following anyone yet</p>
          </div>
          <div
            v-else
            class="divide-y divide-neutral-800"
          >
            <div
              v-for="followingUser in following"
              :key="followingUser.id"
              class="p-4 hover:bg-neutral-900/50 transition"
            >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <router-link :to="`/${followingUser.handle}`">
                  <img 
                    :src="followingUser.avatar" 
                    class="w-12 h-12 rounded-full object-cover border border-neutral-700"
                    :alt="followingUser.name"
                  >
                </router-link>
                <div class="flex-1 min-w-0">
                  <router-link :to="`/${followingUser.handle}`">
                    <h3 class="font-bold truncate hover:underline">{{ followingUser.name }}</h3>
                  </router-link>
                  <p class="text-neutral-500 text-sm truncate">@{{ followingUser.handle }}</p>
                  <p v-if="followingUser.bio" class="text-neutral-400 text-sm mt-1 truncate">{{ followingUser.bio }}</p>
                </div>
              </div>
              <button 
                @click="toggleFollow(followingUser, 'following')"
                :class="{
                  'bg-white text-black': followingUser.isFollowing,
                  'bg-transparent border border-neutral-600 text-white': !followingUser.isFollowing
                }"
                class="px-4 py-1.5 rounded-full text-sm font-bold hover:opacity-90 transition whitespace-nowrap"
              >
                {{ followingUser.isFollowing ? 'Following' : 'Follow' }}
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref,watch, onMounted } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { userService } from '@/services/userService'
import { authService } from '@/services/auth'
import { followService } from '@/services/followService'

const router = useRouter()
const route = useRoute()

type User = {
  id: string
  name: string
  handle: string
  avatar: string
  bio: string
  isFollowing: boolean
  followsYou?: boolean
}

const tabs = [
  { label: 'Followers', value: 'followers' },
  { label: 'Following', value: 'following' }
]

const activeTab = ref<'followers' | 'following'>(
  route.path.endsWith('following') ? 'following' : 'followers'
)

const user = ref({
  _id: '',
  name: '',
  handle: '',
  followersCount: 0,
  followingCount: 0
})

const currentUser = ref<any>(null)
const followers = ref<User[]>([])
const following = ref<User[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const switchTab = (tabValue: 'followers' | 'following') => {
  const username = route.params.user as string
  router.push(`/${username}/${tabValue}`)
}

watch(() => route.path, (path) => {
  activeTab.value = path.endsWith('following') ? 'following' : 'followers'
  fetchFollowData()
})

const fetchFollowData = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Get current logged-in user
    const authResponse = await authService.getCurrentUser()
    currentUser.value = authResponse.user

    // For now, we'll use the current user's data
    // In the future, you can get username from route params
    if (!currentUser.value) {
      error.value = 'Please log in to view followers/following'
      return
    }

    const userData = await userService.getUserById(currentUser.value.id)
    
    user.value = {
      _id: userData._id,
      name: userData.displayName || userData.username,
      handle: userData.username,
      followersCount: userData.followersCount || 0,
      followingCount: userData.followingCount || 0
    }

    // Fetch followers or following based on active tab
    if (activeTab.value === 'followers') {
      const response = await followService.getFollowers(userData._id)
      followers.value = response.followers.map((follower: any) => ({
        id: follower._id,
        name: follower.displayName || follower.username,
        handle: follower.username,
        avatar: follower.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(follower.username)}&background=random`,
        bio: follower.bio || '',
        isFollowing: follower.isFollowing || false,
        followsYou: true
      }))
    } else {
      const response = await followService.getFollowing(userData._id)
      following.value = response.following.map((followingUser: any) => ({
        id: followingUser._id,
        name: followingUser.displayName || followingUser.username,
        handle: followingUser.username,
        avatar: followingUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(followingUser.username)}&background=random`,
        bio: followingUser.bio || '',
        isFollowing: followingUser.isFollowing !== false
      }))
    }
  } catch (err: any) {
    console.error('Error fetching follow data:', err)
    error.value = 'Failed to load followers/following'
  } finally {
    isLoading.value = false
  }
}

const toggleFollow = async (targetUser: User, listType: 'followers' | 'following') => {
  if (!currentUser.value) {
    window.location.href = 'http://localhost:3000/auth/github'
    return
  }

  try {
    if (targetUser.isFollowing) {
      await followService.unfollowUser(targetUser.id)
      targetUser.isFollowing = false
      
      // If unfollowing in the following list, remove the user
      if (listType === 'following') {
        following.value = following.value.filter(u => u.id !== targetUser.id)
        user.value.followingCount = Math.max(0, user.value.followingCount - 1)
      }
    } else {
      await followService.followUser(targetUser.id)
      targetUser.isFollowing = true
      
      if (listType === 'followers') {
        // Update the count
        user.value.followingCount++
      }
    }
  } catch (err: any) {
    console.error('Error toggling follow:', err)
    error.value = 'Failed to update follow status'
  }
}

onMounted(() => {
  fetchFollowData()
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

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>