<script setup lang="ts">
import { RouterView } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import RightPanel from '@/components/RightPanel.vue';
</script>

<template>
  <div class="flex justify-center bg-[#0e0f10] text-white min-h-screen">
    <Sidebar/>
    <RouterView/>
    <RightPanel/>
  </div>
</template>
