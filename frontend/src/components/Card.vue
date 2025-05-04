<template>
  <div class="p-4 border-b border-neutral-800 hover:bg-[#181a1d] transition-colors duration-200">
    <div class="flex gap-3">
      <!-- Avatar -->
      <img 
        :src="post.user.avatar" 
        class="w-12 h-12 rounded-full object-cover border border-neutral-700"
        alt="User avatar"
      >

      <!-- Content -->
      <div class="flex-1">
        <!-- Header -->
        <div class="flex items-center gap-1 text-sm">
          <span class="font-bold text-white">{{ post.user.name }}</span>
          <span class="text-neutral-500">@{{ post.user.handle }}</span>
          <span class="text-neutral-500">·</span>
          <span class="text-neutral-500">{{ post.time }}</span>
          
          <!-- Ellipsis Dropdown -->
          <div class="ml-auto relative">
            <button 
              @click="showDropdown = !showDropdown"
              class="text-neutral-500 hover:text-white p-2 rounded-full hover:bg-neutral-800"
            >
              <Ellipsis/> 
            </button>
            
            <!-- Dropdown Menu -->
            <div 
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-neutral-900 rounded-md shadow-lg border border-neutral-800 z-10"
            >
              <div class="py-1">
                <!-- Delete Option (only shown if current user is post author) -->
                <button
                  v-if="isCurrentUserPost"
                  @click="deletePost"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-neutral-800"
                >
                  <Trash2 class="w-4 h-4 mr-2"/>
                  Delete Post
                </button>
                
                <!-- Other options can be added here -->
                <button
                  class="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-neutral-800"
                >
                  <Flag class="w-4 h-4 mr-2"/>
                  Report Post
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Post Text -->
        <p class="mt-1 text-white text-base">{{ post.content }}</p>

        <!-- Image (optional) -->
        <img 
          v-if="post.image" 
          :src="post.image" 
          class="mt-3 rounded-xl border border-neutral-800 max-h-80 w-full object-cover"
        >

        <!-- Actions -->
        <div class="flex justify-between mt-3 text-neutral-500 max-w-md">
          <!-- Reply -->
          <button class="flex items-center gap-1 hover:text-blue-400 group">
            <div class="p-2 rounded-full group-hover:bg-blue-400/10">
              <MessageCircle class="size-5"/>
            </div>
            <span class="text-sm">{{ post.stats.replies }}</span>
          </button>

          <!-- Repost -->
          <button class="flex items-center gap-1 hover:text-green-500 group">
            <div class="p-2 rounded-full group-hover:bg-green-500/10">
              <GitBranch class="size-5"/>
            </div>
            <span class="text-sm">{{ post.stats.reposts }}</span>
          </button>

          <!-- Like -->
          <button 
            class="flex items-center gap-1 hover:text-pink-500 group"
            @click="post.liked = !post.liked"
          >
            <div class="p-2 rounded-full group-hover:bg-pink-500/10">
              <Heart class="size-5"/>
            </div>
            <span class="text-sm">{{ post.stats.likes }}</span>
          </button>

          <!-- Share -->
          <button class="flex items-center gap-1 hover:text-blue-400 group">
            <div class="p-2 rounded-full group-hover:bg-blue-400/10">
              <Share class="size-5"/>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  GitBranch, 
  MessageCircle, 
  Heart, 
  Share, 
  Ellipsis,
  Trash2,
  Flag
} from 'lucide-vue-next';
import { ref } from 'vue';

const props = defineProps({
  post: {
    type: Object,
    required: true,
    default: () => ({
      id: '1', // Added post ID for deletion
      user: {
        id: '1', // Added user ID
        name: 'John Doe',
        handle: 'johndoe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      content: 'This is a sample post content that shows how the card will look with some text in it.',
      time: '2h ago',
      image: '', // Optional image URL
      liked: false,
      stats: {
        replies: 24,
        reposts: 5,
        likes: 142
      }
    })
  },
  currentUserId: {
    type: String,
    default: '1' // This should come from your auth store
  }
});

const emit = defineEmits(['delete']);

const showDropdown = ref(false);

// Check if current user is the post author
const isCurrentUserPost = props.post.user.id === props.currentUserId;

const deletePost = () => {
  if (confirm('Are you sure you want to delete this post?')) {
    emit('delete', props.post.id);
    showDropdown.value = false;
  }
};
</script>