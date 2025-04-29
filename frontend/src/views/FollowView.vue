<template>
  <div class="flex justify-center bg-[#0e0f10] text-white min-h-screen">
    <Sidebar/>
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
        <!-- Followers Tab Content -->
        <div v-if="activeTab === 'followers'" class="divide-y divide-neutral-800">
          <div 
            v-for="user in followers" 
            :key="user.id"
            class="p-4 hover:bg-neutral-900/50 transition"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img 
                  :src="user.avatar" 
                  class="w-12 h-12 rounded-full object-cover border border-neutral-700"
                  :alt="user.name"
                >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1">
                    <h3 class="font-bold truncate">{{ user.name }}</h3>
                    <span v-if="user.verified" class="text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <p class="text-neutral-500 text-sm truncate">@{{ user.handle }}</p>
                  <p class="text-neutral-400 text-sm mt-1 truncate">{{ user.bio }}</p>
                  <p v-if="user.followsYou" class="text-neutral-500 text-xs mt-1">Follows you</p>
                </div>
              </div>
              <button 
                @click="toggleFollow(user, 'followers')"
                :class="{
                  'bg-white text-black': user.isFollowing,
                  'bg-transparent border border-neutral-600 text-white': !user.isFollowing
                }"
                class="px-4 py-1.5 rounded-full text-sm font-bold hover:opacity-90 transition whitespace-nowrap"
              >
                {{ user.isFollowing ? 'Following' : 'Follow' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Following Tab Content -->
        <div v-if="activeTab === 'following'" class="divide-y divide-neutral-800">
          <div 
            v-for="user in following" 
            :key="user.id"
            class="p-4 hover:bg-neutral-900/50 transition"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img 
                  :src="user.avatar" 
                  class="w-12 h-12 rounded-full object-cover border border-neutral-700"
                  :alt="user.name"
                >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1">
                    <h3 class="font-bold truncate">{{ user.name }}</h3>
                    <span v-if="user.verified" class="text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <p class="text-neutral-500 text-sm truncate">@{{ user.handle }}</p>
                  <p class="text-neutral-400 text-sm mt-1 truncate">{{ user.bio }}</p>
                </div>
              </div>
              <button 
                @click="toggleFollow(user, 'following')"
                :class="{
                  'bg-white text-black': user.isFollowing,
                  'bg-transparent border border-neutral-600 text-white': !user.isFollowing
                }"
                class="px-4 py-1.5 rounded-full text-sm font-bold hover:opacity-90 transition whitespace-nowrap"
              >
                {{ user.isFollowing ? 'Following' : 'Follow' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <RightPanel/>
  </div>
</template>

<script setup lang="ts">
import { ref,watch } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import RightPanel from '@/components/RightPanel.vue'
import { useRouter,useRoute } from 'vue-router'

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

const switchTab = (tabValue: 'followers' | 'following') => {
  router.push(`/user/${tabValue}`)
}

watch(() => route.path, (path) => {
  activeTab.value = path.endsWith('following') ? 'following' : 'followers'
})



const user = ref({
  name: 'Dipstick',
  handle: 'dipsticksi'
})

const followers = ref<User[]>([
  {
    id: '1',
    name: 'John Levio',
    handle: 'johnlev',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: '',
    isFollowing: false,
    followsYou: true
  },
  {
    id: '2',
    name: 'Men I Trust',
    handle: 'menitrust',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Canadian band composed of Dragos, Jessy, and Emma',
    isFollowing: false
  },
  {
    id: '3',
    name: 'Frank Pep',
    handle: 'frep',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    bio: '',
    isFollowing: false,
    followsYou: true
  },
  {
    id: '4',
    name: 'Shawn Kale',
    handle: 'shawn__kale',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    bio: 'its so over',
    isFollowing: false,
    followsYou: true
  },
])

const following = ref<User[]>([
  {
    id: '7',
    name: 'SunBeam',
    handle: 'SunBeamLab',
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    bio: 'Explore the integration',
    isFollowing: true,
  },
  {
    id: '8',
    name: 'CatWow',
    handle: 'catwow',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    bio: '',
    isFollowing: true
  },
  {
    id: '9',
    name: 'rOMBole not',
    handle: 'r0not',
    avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
    bio: 'icl ts pmo',
    isFollowing: true
  }
])

const toggleFollow = (user: User, listType: 'followers' | 'following') => {
  user.isFollowing = !user.isFollowing
  // API call would go here
  
  // If unfollowing in the following list, remove the user
  if (listType === 'following' && !user.isFollowing) {
    following.value = following.value.filter(u => u.id !== user.id)
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

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>