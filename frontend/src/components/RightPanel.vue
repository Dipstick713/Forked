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
    window.location.href = 'http://localhost:3000/auth/github';
  }
};
</script>

<template>
    <aside class="w-80 p-4 border-l border-[#253446]">
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
    </aside>
  </template>
  