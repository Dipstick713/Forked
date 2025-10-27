<template>
  <div class="flex items-center justify-center min-h-screen bg-[#0e0f10]">
    <div class="w-full max-w-md p-8">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-3 mb-4">
           <GitFork class="w-12 h-12 text-green-500" />
          <h1 class="text-4xl font-bold text-white">Forked</h1>
        </div>
        <p class="text-neutral-400 text-lg">Join the conversation, fork the discussion</p>
      </div>

      <!-- Login Card -->
      <div class="bg-[#0e0f10] rounded-2xl border border-neutral-800 p-8 shadow-2xl">
        <h2 class="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        
        <p class="text-neutral-400 text-center mb-6">
          Sign in with your GitHub account to continue
        </p>

        <!-- GitHub Login Button -->
        <button
          @click="authService.loginWithGitHub()"
          class="flex items-center justify-center gap-3 w-full bg-zinc-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 border border-neutral-700 hover:border-neutral-600"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>

        <!-- Back to Home -->
        <button
          @click="router.push('/')"
          class="w-full mt-4 text-neutral-400 hover:text-white text-sm transition"
        >
          ← Back to Home
        </button>

      </div>

      <!-- Features -->
      <div class="mt-8 grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-green-500 text-2xl font-bold">Fork</div>
          <div class="text-neutral-500 text-sm mt-1">Discussions</div>
        </div>
        <div>
          <div class="text-green-500 text-2xl font-bold">Share</div>
          <div class="text-neutral-500 text-sm mt-1">Ideas</div>
        </div>
        <div>
          <div class="text-green-500 text-2xl font-bold">Connect</div>
          <div class="text-neutral-500 text-sm mt-1">People</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth'
import { GitFork } from 'lucide-vue-next'

const router = useRouter()

// Check if user is already logged in
onMounted(async () => {
  try {
    const response = await authService.getCurrentUser()
    if (response.user) {
      // User is already logged in, redirect to home
      router.push('/')
    }
  } catch (error) {
    // User not logged in, stay on login page
  }
})
</script>
