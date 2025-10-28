<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import RightPanel from '@/components/RightPanel.vue';
import api from '@/api/axios';

const isSidebarOpen = ref(false);
const router = useRouter();
const route = useRoute();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

// Handle OAuth callback with token
onMounted(async () => {
  const authToken = route.query.auth_token as string;
  
  if (authToken) {
    try {
      console.log('Exchanging auth token...');
      await api.post('/auth/exchange-token', { token: authToken });
      console.log('Token exchanged successfully');
      
      // Remove token from URL
      router.replace({ query: {} });
      
      // Reload to fetch user data
      window.location.reload();
    } catch (error) {
      console.error('Token exchange failed:', error);
      router.push('/login?error=token_exchange_failed');
    }
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
