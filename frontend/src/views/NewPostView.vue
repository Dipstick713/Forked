<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import RightPanel from '@/components/RightPanel.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const postContent = ref('')
const isPosting = ref(false)
const selectedFile = ref<File | null>(null)
const previewImage = ref('')

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
    previewImage.value = URL.createObjectURL(input.files[0])
  }
}

const removeImage = () => {
  selectedFile.value = null
  previewImage.value = ''
}

const createPost = async () => {
  if (!postContent.value.trim() && !selectedFile.value) return
  
  isPosting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset form
    postContent.value = ''
    selectedFile.value = null
    previewImage.value = ''
    
    // Redirect to home or show success message
    router.push('/')
  } catch (error) {
    console.error('Error creating post:', error)
  } finally {
    isPosting.value = false
  }
}
</script>

<template>
  <div class="flex justify-center bg-[#0e0f10] text-white min-h-screen">
    <Sidebar/>
    <div class="w-full max-w-[600px] border-x border-neutral-800 min-h-screen">
      <!-- Header -->
      <div class="sticky top-0 z-10 bg-[#0e0f10]/90 backdrop-blur-sm p-4 border-b border-neutral-800">
        <div class="flex items-center justify-between">
          <button @click="router.back()" class="rounded-full p-2 hover:bg-neutral-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-xl font-bold">New Post</h1>
          <button 
            @click="createPost"
            :disabled="isPosting || (!postContent.trim() && !selectedFile)"
            :class="{
              'opacity-50 cursor-not-allowed': isPosting || (!postContent.trim() && !selectedFile),
              'hover:bg-green-600': !isPosting && (postContent.trim() || selectedFile)
            }"
            class="px-4 py-1 bg-green-500 rounded-full font-bold transition"
          >
            {{ isPosting ? 'Posting...' : 'Post' }}
          </button>
        </div>
      </div>

      <!-- Post Form -->
      <div class="p-4">
        <textarea
          v-model="postContent"
          placeholder="What's happening?"
          class="w-full bg-transparent text-white placeholder-neutral-500 outline-none resize-none min-h-[70px]"
          autofocus
        ></textarea>

        <!-- Image Preview -->
        <div v-if="previewImage" class="mt-4 relative">
          <img :src="previewImage" alt="Preview" class="rounded-xl max-h-80 w-full object-contain border border-neutral-700">
          <button
            @click="removeImage"
            class="absolute top-2 right-2 bg-black/70 rounded-full p-2 hover:bg-black/90 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Attachment Options -->
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-neutral-800">
          <div class="flex space-x-4">
            <label class="cursor-pointer">
              <input type="file" accept="image/*" class="hidden" @change="handleFileChange">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 hover:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </label>
            <!-- Add more attachment options here if needed -->
          </div>

          <div class="text-neutral-500 text-sm">
            {{ postContent.length }}/280
          </div>
        </div>
      </div>
    </div>
    <RightPanel/>
  </div>
</template>