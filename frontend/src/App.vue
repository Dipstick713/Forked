<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import RightPanel from '@/components/RightPanel.vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
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
