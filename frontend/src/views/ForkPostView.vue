<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Image, X, ArrowLeft, GitBranch } from 'lucide-vue-next'
import { VueSpinnerOrbit } from 'vue3-spinners'
import { postService } from '@/services/postService'
import { authService } from '@/services/auth'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const postContent = ref('')
const isPosting = ref(false)
const selectedFile = ref<File | null>(null)
const previewImage = ref('')
const error = ref<string | null>(null)
const currentUser = ref<any>(null)
const originalPost = ref<any>(null)
const isLoading = ref(true)

// Fetch the original post and current user
onMounted(async () => {
  try {
    // Fetch current user
    const authResponse = await authService.getCurrentUser()
    currentUser.value = authResponse.user

    // Fetch the original post
    const postId = route.params.id as string
    const postData = await postService.getPost(postId)
    
    originalPost.value = {
      id: postData._id,
      user: {
        id: postData.author._id,
        name: postData.author.displayName || postData.author.username,
        handle: postData.author.username,
        avatar: postData.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(postData.author.username)}&background=random`
      },
      content: postData.content,
      image: postData.image || '',
      createdAt: postData.createdAt
    }
  } catch (err) {
    console.error('Error loading:', err)
    error.value = 'Failed to load post'
  } finally {
    isLoading.value = false
  }
})

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'Image size must be less than 5MB'
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      error.value = 'Please select a valid image file'
      return
    }
    
    selectedFile.value = file
    previewImage.value = URL.createObjectURL(file)
    error.value = null
  }
}

const removeImage = () => {
  if (previewImage.value) {
    URL.revokeObjectURL(previewImage.value)
  }
  selectedFile.value = null
  previewImage.value = ''
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

const createFork = async () => {
  if (!postContent.value.trim() && !selectedFile.value) {
    error.value = 'Please add some content to your fork'
    return
  }
  
  if (!currentUser.value) {
    error.value = 'You must be logged in to fork a post'
    setTimeout(() => {
      window.location.href = 'http://localhost:3000/auth/github'
    }, 1500)
    return
  }
  
  // Validate content length
  if (postContent.value.length > 280) {
    error.value = 'Post content must be 280 characters or less'
    return
  }
  
  isPosting.value = true
  error.value = null
  
  try {
    // Prepare fork data
    const forkData: any = {
      content: postContent.value.trim(),
      forkedFrom: originalPost.value.id
    }
    
    // Add image file if selected
    if (selectedFile.value) {
      forkData.image = selectedFile.value
    }
    
    // Create fork via API
    const newFork = await postService.createPost(forkData)
    
    // Show success toast
    toast.success('Fork created successfully!', { timeout: 2000 })
    
    // Reset form
    postContent.value = ''
    removeImage()
    
    // Redirect to home
    router.push('/')
  } catch (err: any) {
    console.error('Error creating fork:', err)
    if (err.response?.status === 401) {
      error.value = 'Your session has expired. Please log in again.'
      toast.error('Session expired. Redirecting to login...')
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/auth/github'
      }, 2000)
    } else {
      error.value = err.response?.data?.message || 'Failed to create fork. Please try again.'
      toast.error(error.value)
    }
  } finally {
    isPosting.value = false
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  // Ctrl/Cmd + Enter to post
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    createFork()
  }
}
</script>

<template>
  <div class="w-full max-w-[600px] border-x border-neutral-800 min-h-screen">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-[#0e0f10]/90 backdrop-blur-sm p-4 border-b border-neutral-800">
      <div class="flex items-center justify-between">
        <button @click="router.back()" class="rounded-full p-2 hover:bg-neutral-800 transition">
          <ArrowLeft :size="20" />
        </button>
        <h1 class="text-xl font-bold flex items-center gap-2">
          <GitBranch :size="20" />
          Fork Post
        </h1>
        <button 
          @click="createFork"
          :disabled="isPosting || (!postContent.trim() && !selectedFile) || isLoading"
          :class="{
            'opacity-50 cursor-not-allowed': isPosting || (!postContent.trim() && !selectedFile) || isLoading,
            'hover:bg-green-600': !isPosting && (postContent.trim() || selectedFile) && !isLoading
          }"
          class="px-4 py-1.5 bg-green-500 text-black rounded-full font-bold transition"
        >
          {{ isPosting ? 'Forking...' : 'Fork' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center p-20">
      <div class="text-center">
        <VueSpinnerOrbit :size="60" color="#22c55e" />
        <p class="text-neutral-500 mt-4">Loading post...</p>
      </div>
    </div>

    <!-- Fork Form -->
    <div v-else class="p-4">
      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
        {{ error }}
      </div>

      <!-- Your Fork Content -->
      <div class="mb-4">
        <textarea
          v-model="postContent"
          @keydown="handleKeyDown"
          placeholder="Add your thoughts..."
          maxlength="280"
          class="w-full bg-transparent text-white placeholder-neutral-500 outline-none resize-none min-h-[100px] text-lg"
          autofocus
        ></textarea>

        <!-- Image Preview -->
        <div v-if="previewImage" class="mt-4 relative">
          <img :src="previewImage" alt="Preview" class="rounded-xl max-h-80 w-full object-contain border border-neutral-700">
          <button
            @click="removeImage"
            class="absolute top-2 right-2 bg-black/70 rounded-full p-2 hover:bg-black/90 transition"
          >
            <X :size="20" />
          </button>
        </div>
      </div>

      <!-- Original Post -->
      <div class="border-l-2 border-neutral-700 pl-4 mt-4">
        <div class="text-neutral-500 text-sm mb-2 flex items-center gap-1">
          <GitBranch :size="14" />
          Forking from
        </div>
        <div class="p-3 border border-neutral-800 rounded-lg bg-neutral-900/50">
          <div class="flex gap-3">
            <img 
              :src="originalPost.user.avatar" 
              class="w-10 h-10 rounded-full object-cover border border-neutral-700 flex-shrink-0"
              alt="User avatar"
            >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1 text-sm">
                <span class="font-bold text-white">{{ originalPost.user.name }}</span>
                <span class="text-neutral-500">@{{ originalPost.user.handle }}</span>
                <span class="text-neutral-500">·</span>
                <span class="text-neutral-500">{{ formatTimeAgo(originalPost.createdAt) }}</span>
              </div>
              <p class="mt-1 text-white text-sm">{{ originalPost.content }}</p>
              
              <!-- Original Post Image -->
              <img 
                v-if="originalPost.image" 
                :src="originalPost.image" 
                class="mt-2 rounded-lg border border-neutral-800 max-h-60 w-full object-cover"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Attachment Options -->
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-neutral-800">
        <div class="flex space-x-4">
          <label class="cursor-pointer group">
            <input type="file" accept="image/*" class="hidden" @change="handleFileChange">
            <div class="p-2 rounded-full hover:bg-green-500/10 transition">
              <Image :size="20" class="text-green-500 group-hover:text-green-400 transition" />
            </div>
          </label>
        </div>

        <div class="text-neutral-500 text-sm">
          <span :class="{ 'text-yellow-500': postContent.length > 250, 'text-red-500': postContent.length >= 280 }">
            {{ postContent.length }}/280
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
