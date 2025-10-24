<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Image, X, ArrowLeft } from 'lucide-vue-next'
import { postService } from '@/services/postService'
import { authService } from '@/services/auth'

const router = useRouter()
const postContent = ref('')
const isPosting = ref(false)
const selectedFile = ref<File | null>(null)
const previewImage = ref('')
const error = ref<string | null>(null)
const currentUser = ref<any>(null)

// Check if user is authenticated
onMounted(async () => {
  try {
    const authResponse = await authService.getCurrentUser()
    currentUser.value = authResponse.user
  } catch (err) {
    // Redirect to home if not authenticated
    console.error('Not authenticated:', err)
    router.push('/')
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

const createPost = async () => {
  if (!postContent.value.trim() && !selectedFile.value) return
  
  if (!currentUser.value) {
    error.value = 'You must be logged in to create a post'
    // Redirect to GitHub OAuth login
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
    // Prepare post data
    const postData: any = {
      content: postContent.value.trim()
    }
    
    // TODO: Handle image upload
    // For now, we'll just send the post without image
    // In the future, you'll need to upload the image to a storage service
    // and include the URL in postData.image
    
    if (selectedFile.value) {
      // Placeholder for image upload
      console.log('Image upload not implemented yet:', selectedFile.value)
      // postData.image = await uploadImage(selectedFile.value)
    }
    
    // Create post via API
    const newPost = await postService.createPost(postData)
    console.log('Post created successfully:', newPost)
    
    // Reset form
    postContent.value = ''
    removeImage()
    
    // Redirect to home
    router.push('/')
  } catch (err: any) {
    console.error('Error creating post:', err)
    if (err.response?.status === 401) {
      error.value = 'Your session has expired. Please log in again.'
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/auth/github'
      }, 2000)
    } else {
      error.value = err.response?.data?.message || 'Failed to create post. Please try again.'
    }
  } finally {
    isPosting.value = false
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  // Ctrl/Cmd + Enter to post
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    createPost()
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
          <h1 class="text-xl font-bold">New Post</h1>
          <button 
            @click="createPost"
            :disabled="isPosting || (!postContent.trim() && !selectedFile)"
            :class="{
              'opacity-50 cursor-not-allowed': isPosting || (!postContent.trim() && !selectedFile),
              'hover:bg-green-600': !isPosting && (postContent.trim() || selectedFile)
            }"
            class="px-4 py-1.5 bg-green-500 text-black rounded-full font-bold transition"
          >
            {{ isPosting ? 'Posting...' : 'Post' }}
          </button>
        </div>
      </div>

      <!-- Post Form -->
      <div class="p-4">
        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
          {{ error }}
        </div>

        <textarea
          v-model="postContent"
          @keydown="handleKeyDown"
          placeholder="What's happening?"
          maxlength="280"
          class="w-full bg-transparent text-white placeholder-neutral-500 outline-none resize-none min-h-[120px] text-lg"
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