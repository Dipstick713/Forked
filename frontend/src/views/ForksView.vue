<template>
    <div class="flex justify-center bg-[#0e0f10] text-white min-h-screen">
      <Sidebar/>
      
      <div class="flex flex-col w-full max-w-[600px] border-x border-neutral-800 h-screen overflow-hidden">
        <!-- Header -->
        <div class="sticky top-0 z-10 bg-[#0e0f10] p-4 border-b border-neutral-800 flex items-center">
          <button @click="goBack" class="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <h1 class="text-xl font-bold">Forked Posts</h1>
        </div>
        
        <!-- Thread visualization with background visible -->
        <div class="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide space-y-4">
          <!-- Parent post (blue) -->
          <div v-if="parentPost" class="relative">
            <div class="text-xs text-neutral-500 mb-2 pl-6">Parent Post</div>
            <div class="relative pl-6">
              <div class="absolute left-0 top-0 h-full w-0.5 bg-blue-500 rounded-full"></div>
              <div class="bg-[#0e0f10] bg-opacity-70 backdrop-blur-sm rounded-xl border border-blue-500 border-opacity-30 p-4 shadow-lg">
                <Card :post="parentPost" />
              </div>
            </div>
          </div>
          
          <!-- Current post (green) -->
          <div class="relative">
            <div class="text-xs text-neutral-500 mb-2 pl-6">Current Post</div>
            <div class="relative pl-6">
              <div class="absolute left-0 top-0 h-full w-0.5 bg-green-500 rounded-full"></div>
              <div class="bg-[#0e0f10] bg-opacity-70 backdrop-blur-sm rounded-xl border border-green-500 border-opacity-30 p-4 shadow-lg">
                <Card :post="currentPost" />
              </div>
            </div>
          </div>
          
          <!-- Child posts (neutral) -->
          <div v-if="childPosts.length" class="space-y-4 pl-8">
            <div class="text-xs text-neutral-500 mb-2 pl-6">Forked Posts ({{ childPosts.length }})</div>
            <div v-for="(child, index) in childPosts" :key="child._id" class="relative pl-6">
              <div class="absolute left-0 top-0 h-full w-0.5 bg-neutral-700 rounded-full"></div>
              <div class="bg-[#0e0f10] bg-opacity-70 backdrop-blur-sm rounded-xl border border-neutral-800 p-4 shadow-lg">
                <Card :post="child" />
              </div>
            </div>
          </div>
          <div v-else class="p-8 text-center text-neutral-500">
            No connected posts yet. Start a new branch!
          </div>
        </div>
      </div>
      
      <RightPanel/>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Sidebar from '@/components/Sidebar.vue'
  import Card from '@/components/Card.vue'
  import RightPanel from '@/components/RightPanel.vue'
  
  // Hardcoded data
  const currentPost = {
    _id: '2',
    content: "Social media creates connection illusions while actually isolating us. What do you think?",
    authorId: 'user2',
    parentId: '1',
    threadId: '1',
    createdAt: new Date(Date.now() - 3600000),
    children: ['4', '5'],
    user: {
      name: 'Social Critic',
      handle: 'critique42',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    stats: {
      replies: 2,
      reposts: 3,
      likes: 28
    }
  }
  
  const parentPost = {
    _id: '1',
    content: "Is loneliness a modern disease or just part of life?",
    authorId: 'user1',
    parentId: null,
    threadId: '1',
    createdAt: new Date(),
    children: ['2', '3'],
    user: {
      name: 'Philosophy Fan',
      handle: 'deep_thinker',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    stats: {
      replies: 2,
      reposts: 5,
      likes: 42
    }
  }
  
  const childPosts = [
    {
      _id: '4',
      content: "The scale is different now - more people report chronic loneliness than ever before.",
      authorId: 'user4',
      parentId: '2',
      threadId: '1',
      createdAt: new Date(Date.now() - 1800000),
      children: [],
      user: {
        name: 'Data Analyst',
        handle: 'numbers_dont_lie',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      },
      stats: {
        replies: 0,
        reposts: 1,
        likes: 9
      }
    },
    {
      _id: '5',
      content: "I believe it's always been there but we're more aware of it now.",
      authorId: 'user5',
      parentId: '2',
      threadId: '1',
      createdAt: new Date(Date.now() - 1200000),
      children: [],
      user: {
        name: 'History Buff',
        handle: 'past_glances',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
      },
      stats: {
        replies: 0,
        reposts: 2,
        likes: 15
      }
    }
  ]
  
  const router = useRouter()
  
  const goBack = () => {
    router.go(-1)
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
  
  /* Floating effect */
  .bg-opacity-70 {
    background-color: rgba(14, 15, 16, 0.7);
  }
  
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
  
  .user-info {
  min-width: 0;
  flex: 1;
}

.user-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
}

.user-handle {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
  color: #737373;
  font-size: 0.875rem;
}
</style>