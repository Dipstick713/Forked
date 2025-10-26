<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="cancel"
      >
        <div class="bg-[#0e0f10] rounded-2xl border border-neutral-800 shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
          <!-- Header -->
          <div class="p-6 pb-4">
            <h3 class="text-xl font-bold text-white">{{ title }}</h3>
            <p class="text-neutral-400 mt-2">{{ message }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 p-6 pt-0">
            <button
              @click="cancel"
              class="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full font-semibold transition"
            >
              Cancel
            </button>
            <button
              @click="confirm"
              class="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
