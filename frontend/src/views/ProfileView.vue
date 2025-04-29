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
            <h1 class="text-xl font-bold">{{ user.name }}</h1>
            <p class="text-sm text-neutral-500">{{ posts.length }} posts</p>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto scrollbar-hide">
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
              @click="toggleFollow"
              :class="{
                'bg-white border border-black text-black': isFollowing,
                'bg-transparent border border-neutral-600 text-white': !isFollowing
              }"
              class="px-4 py-1.5 rounded-full font-bold hover:opacity-90 transition"
            >
              {{ isFollowing ? 'Following' : 'Follow' }}
            </button>
          </div>
  
          <!-- User Info -->
          <div class="mt-6">
            <h1 class="text-xl font-bold">{{ user.name }}</h1>
            <p class="text-neutral-500">@{{ user.handle }}</p>
            <p class="mt-3">{{ user.bio }}</p>
            
            <div class="flex gap-4 mt-3 text-neutral-500 text-sm">
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ user.location }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <a :href="user.website" target="_blank" class="text-green-500 hover:underline">{{ user.website }}</a>
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
          <PostCard 
            v-for="post in posts" 
            :key="post.id" 
            :post="post"
          />
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
  import { onMounted, ref } from 'vue'
  import Sidebar from '@/components/Sidebar.vue'
  import RightPanel from '@/components/RightPanel.vue'
  import PostCard from '@/components/Card.vue'
  
  const activeTab = ref<string>('Posts')
  const tabs = ['Posts', 'Likes']
  const isFollowing = ref(false)
  
  const user = ref({
    name: 'John Doe',
    handle: 'johndoe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    coverPhoto: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    bio: 'Digital creator | Web developer | Coffee enthusiast',
    location: 'San Francisco, CA',
    website: 'johndoe.dev',
    joinDate: 'June 2018',
    followersCount: 1243,
    followingCount: 542
  })
  
  const posts = ref([
    {
      id: 1,
      user: {
        name: 'John Doe',
        handle: 'johndoe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      content: 'Just launched my new portfolio website! Check it out at johndoe.dev #webdev #portfolio',
      time: '2h ago',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      stats: {
        replies: 24,
        reposts: 5,
        likes: 142
      }
    },
    {
      id: 2,
      user: {
        name: 'John Doe',
        handle: 'johndoe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      content: 'Working on a new project using Vue 3 and Tailwind CSS. Really enjoying the developer experience!',
      time: '1d ago',
      stats: {
        replies: 8,
        reposts: 2,
        likes: 56
      }
    },
    {
      id: 3,
      user: {
        name: 'John Doe',
        handle: 'johndoe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      content: 'Test testing',
      time: '2d ago',
      stats: {
        replies: 24,
        reposts: 5,
        likes: 142
      }
    }
  ])
  
  const toggleFollow = () => {
    isFollowing.value = !isFollowing.value
    // Here you would typically make an API call to update the follow status
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