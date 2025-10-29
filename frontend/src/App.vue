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
  console.log('App.vue mounted, checking for token/error in URL');
  console.log('Current URL:', window.location.href);
  console.log('Raw search params:', window.location.search);
  console.log('Vue Router query:', route.query);
  console.log('All query keys:', Object.keys(route.query));
  
  const token = route.query.token as string;
  const error = route.query.error as string;
  
  console.log('Token from route.query.token:', token);
  console.log('Token type:', typeof token);
  console.log('Token truthy?:', !!token);
  
  // Also try getting directly from URL
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');
  console.log('Token from URLSearchParams:', tokenFromUrl);
  
  if (error) {
    console.error('OAuth error received:', error);
    // Handle error - could show a toast notification
    await router.replace({ query: {} });
    return;
  }
  
  const finalToken = token || tokenFromUrl;
  
  if (finalToken) {
    console.log('Token found! Length:', finalToken.length);
    console.log('Storing token in localStorage...');
    
    // Store JWT token directly using localStorage
    localStorage.setItem('forked_auth_token', finalToken);
    
    // Verify storage
    const storedToken = localStorage.getItem('forked_auth_token');
    console.log('Token stored successfully:', !!storedToken);
    console.log('Stored token matches:', storedToken === finalToken);
    
    // Clean URL and force reload
    console.log('Redirecting to home with reload...');
    window.location.replace('/');
  } else {
    console.log('No token or error in URL');
    const existingToken = tokenStorage.getToken();
    if (existingToken) {
      console.log('Found existing token in localStorage');
    } else {
      console.log('No token in localStorage');
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
