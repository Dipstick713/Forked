<template>
    <div class="flex justify-center bg-[#0e0f10] text-white min-h-screen">
      <Sidebar/>
      <div class="w-full max-w-[600px] border-x border-neutral-800 min-h-screen">
        <!-- Post Header -->
        <div class="sticky top-0 z-10 bg-[#0e0f10]/90 backdrop-blur-sm p-4 border-b border-neutral-800 flex items-center gap-4">
          <button @click="$router.back()" class="rounded-full p-2 hover:bg-neutral-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-xl font-bold">Post</h1>
        </div>
  
        <!-- Main Post -->
        <div class="p-4 border-b border-neutral-800">
          <div class="flex gap-3">
            <img 
              src="https://randomuser.me/api/portraits/men/1.jpg" 
              class="w-12 h-12 rounded-full object-cover border border-neutral-700"
              alt="User avatar"
            >
            <div class="flex-1">
              <div class="flex items-center gap-1">
                <span class="font-bold">John Doe</span>
                <span class="text-neutral-500">@johndoe</span>
                <span class="text-neutral-500">·</span>
                <span class="text-neutral-500">2h ago</span>
              </div>
              <p class="mt-1 text-white">This is the main post content. It can be multiple lines long and will wrap naturally within the container. The design follows the X/Twitter style but with your dark theme colors.</p>
              
              <div class="flex justify-between mt-3 text-neutral-500 max-w-md">
          <!-- Reply -->
          <button class="flex items-center gap-1 hover:text-blue-400 group">
            <div class="p-2 rounded-full group-hover:bg-blue-400/10">
              <MessageCircle class="size-5"/>
            </div>
            <span class="text-sm">4</span>
          </button>

          <!-- Repost -->
          <button class="flex items-center gap-1 hover:text-green-500 group">
            <div class="p-2 rounded-full group-hover:bg-green-500/10">
              <GitBranch class="size-5"/>
            </div>
            <span class="text-sm">3</span>
          </button>

          <!-- Like -->
          <button 
            class="flex items-center gap-1 hover:text-pink-500 group"
            
          >
            <div class="p-2 rounded-full group-hover:bg-pink-500/10">
              <Heart class="size-5"/>
            </div>
            <span class="text-sm">6</span>
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
        <div class="p-4 border-b border-neutral-800">
    <div class="flex gap-3">
      <img 
        src="https://randomuser.me/api/portraits/women/44.jpg" 
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
          style="line-height: 1.5;"
        ></textarea>
        
        <div v-if="replyText" class="flex justify-end mt-2">
          <button 
            class="bg-green-500 hover:bg-green-600 text-black px-4 py-1.5 rounded-full font-bold text-sm"
            @click="postReply"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  </div>
        <!-- Replies -->
        <div class="divide-y divide-neutral-800">
          <div v-for="reply in replies" :key="reply.id" class="p-4 hover:bg-neutral-900/50">
            <div class="flex gap-3">
              <img 
                :src="reply.user.avatar" 
                class="w-10 h-10 rounded-full object-cover border border-neutral-700"
                alt="User avatar"
              >
              <div class="flex-1">
                <div class="flex items-center gap-1 text-sm">
                  <span class="font-bold">{{ reply.user.name }}</span>
                  <span class="text-neutral-500">@{{ reply.user.handle }}</span>
                  <span class="text-neutral-500">·</span>
                  <span class="text-neutral-500">{{ reply.time }}</span>
                </div>
                <p class="mt-1 text-white text-sm">{{ reply.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RightPanel/>
    </div>
  </template>
  
  <script setup lang="ts">
  import Sidebar from '@/components/Sidebar.vue'
  import RightPanel from '@/components/RightPanel.vue'
  import { GitBranch, MessageCircle, Heart, Share, Ellipsis } from 'lucide-vue-next';
  const replies = [
    {
      id: 1,
      user: {
        name: 'Jane Smith',
        handle: 'janesmith',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      content: 'This is a great post! I completely agree with your points.',
      time: '1h ago'
    },
    {
      id: 2,
      user: {
        name: 'Alex Johnson',
        handle: 'alexj',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      content: 'Interesting perspective. Have you considered the alternative approach?',
      time: '45m ago'
    },
    {
      id: 3,
      user: {
        name: 'Sam Wilson',
        handle: 'samwilson',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
      },
      content: 'Thanks for sharing this information! Very helpful.',
      time: '30m ago'
    }
  ]

  import { ref, nextTick, onMounted } from 'vue'

const replyText = ref('')
const textarea = ref<HTMLTextAreaElement | null>(null)

const adjustTextareaHeight = () => {
  if (!textarea.value) return
  
  nextTick(() => {
    try {
      // Reset height to auto to get correct scrollHeight
      textarea.value.style.height = 'auto'
      
      // Get computed line height
      const lineHeight = parseInt(window.getComputedStyle(textarea.value).lineHeight) || 24
      
      // Set new height (minimum 1 line, maximum content height)
      textarea.value.style.height = `${Math.max(
        textarea.value.scrollHeight,
        lineHeight
      )}px`
    } catch (error) {
      console.error('Error adjusting textarea height:', error)
    }
  })
}

const postReply = () => {
  if (!textarea.value) return
  
  console.log('Posting reply:', replyText.value)
  replyText.value = ''
  textarea.value.style.height = 'auto'
}

// Initialize height on mount
onMounted(() => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
  }
})
</script>