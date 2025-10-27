<script setup lang="ts">
import { Menu } from 'lucide-vue-next';

defineEmits(['toggle']);
</script>

<template>
  <button 
    @click="$emit('toggle')"
    class="lg:hidden p-2 hover:bg-neutral-800 rounded-lg transition-colors"
    aria-label="Toggle menu"
  >
    <Menu :size="24"/>
  </button>
</template>
