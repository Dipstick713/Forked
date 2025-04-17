<template>
  <div class="flex justify-center bg-[#0e0f10] text-white min-h-screen">
    <!-- Container with max width like a phone -->
    <Sidebar/>
    <div class="w-full max-w-[600px] border-x border-neutral-800 min-h-screen px-4 py-6">
      
      <div v-if="posts.length">
        <Card 
          v-for="post in posts" 
          :key="post.id" 
          :post="post" 
        />
      </div>
      <div v-else class="p-8 text-center text-neutral-500">
        No posts yet
      </div>
    </div>
    <RightPanel/>
  </div>
</template>


<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import Card from '@/components/Card.vue'
import RightPanel from '@/components/RightPanel.vue'

const posts = [
  {
    id: 1,
    user: {
      name: 'Jane Smith',
      handle: 'janesmith',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    content: 'Just launched our new product! Check it out at example.com #excited',
    time: '1h ago',
    image: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    liked: false,
    stats: {
      replies: 14,
      reposts: 5,
      likes: 89
    }
  },
  {
    id: 2,
    user: {
      name: 'Alex Johnson',
      handle: 'alexj',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    content: 'Working on some exciting new features for our app. Stay tuned for updates! #development #coding',
    time: '3h ago',
    image: '',
    liked: true,
    stats: {
      replies: 8,
      reposts: 2,
      likes: 56
    }
  }
]
</script>
