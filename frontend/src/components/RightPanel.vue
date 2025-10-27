<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from './SearchBar.vue';
import { authService } from '@/services/auth';

const router = useRouter();
const currentUser = ref<any>(null);

onMounted(async () => {
  try {
    const response = await authService.getCurrentUser();
    currentUser.value = response.user;
  } catch (error) {
    console.error('Error fetching current user:', error);
  }
});

const goToNewPost = () => {
  if (currentUser.value && currentUser.value.username) {
    router.push(`/${currentUser.value.username}/newpost`);
  } else {
    // Fallback to login or home if not authenticated
    authService.loginWithGitHub();
  }
};
</script>

<template>
  <aside class="w-80 p-4 border-l border-[#253446]">
    <!-- Only show if user is logged in -->
    <template v-if="currentUser">
      <div class="bg-gradient-to-br from-green-500 via-green-400 to-blue-300 p-4 rounded-lg mb-6">        
        <p class="text-sm text-[#0e0f10] font-bold">Plant a new seed of thought.</p>
        <button 
          @click="goToNewPost"
          class="mt-3 bg-[#0e0f10] text-green-400 text-sm px-3 py-1 rounded-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-blue-500 hover:text-[#0e0f10] transition duration-300"
        >
          Create Post
        </button>
      </div>
      <SearchBar/>
    </template>

    <!-- Show login prompt if not logged in -->
    <div v-else class="bg-[#16181a] border border-neutral-800 rounded-xl p-6">
      <h3 class="text-lg font-bold text-white mb-2">New to Forked?</h3>
      <p class="text-neutral-400 text-sm mb-4">Sign in to start forking discussions and sharing ideas.</p>
      <button
        @click="authService.loginWithGitHub()"
        class="block w-full text-center bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-full transition"
      >
        Sign in with GitHub
      </button>
    </div>
  </aside>
</template>
  