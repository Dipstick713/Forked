<script setup lang="ts">
import SearchBar from './SearchBar.vue';
</script>

<template>
    <aside class="w-80 p-4 border-l border-[#253446]">
      <div class="bg-gradient-to-br from-green-400/100 to-yellow-400/100 p-4 rounded-lg mb-6">
        
        <p class="text-sm text-[#0e0f10] font-bold">Plant a new seed of thought.</p>
        <button class="mt-3 bg-[#0e0f10] text-green-400/100 text-sm px-3 py-1 rounded-lg hover:bg-green-400">
          Create Post
        </button>
      </div>
      <SearchBar/>
    </aside>
  </template>
  