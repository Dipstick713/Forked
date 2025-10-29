<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import RightPanel from '@/components/RightPanel.vue';
import { tokenStorage } from '@/utils/tokenStorage';

const isSidebarOpen = ref(false);
const router = useRouter();
const route = useRoute();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

// Handle OAuth callback with JWT token
onMounted(async () => {
  const token = route.query.token as string;
  const error = route.query.error as string;
  
  // Also try getting directly from URL
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');
  
  if (error) {
    console.error('OAuth error received:', error);
    await router.replace({ query: {} });
    return;
  }
  
  const finalToken = token || tokenFromUrl;
  
  if (finalToken) {
    console.log('Token received, storing in localStorage');
    
    // Store JWT token directly using localStorage
    localStorage.setItem('forked_auth_token', finalToken);
    
    // Clean URL and force reload
    window.location.replace('/');
  }
});
</script>

<template>
  <div class="flex justify-center bg-[#0e0f10] text-white min-h-screen">
    <!-- Mobile overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    ></div>
    
    <Sidebar :isOpen="isSidebarOpen" @close="closeSidebar" @toggle="toggleSidebar"/>
    <RouterView @toggleSidebar="toggleSidebar"/>
    <RightPanel class="hidden lg:block"/>
  </div>
</template>
