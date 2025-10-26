<template>
  <div class="p-4 border-b border-neutral-800 hover:bg-[#181a1d] transition-colors duration-200">
    <div class="flex gap-3">
      <!-- Avatar -->
      <img 
        :src="post.user.avatar" 
        class="w-12 h-12 rounded-full object-cover border border-neutral-700 flex-shrink-0 cursor-pointer hover:opacity-90 transition"
        alt="User avatar"
        @click="goToProfile"
      >

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Header -->
        <div class="flex items-center gap-1 text-sm">
          <div class="flex items-baseline min-w-0 max-w-[calc(100%-40px)]">
            <span 
              class="font-bold text-white truncate max-w-[120px] cursor-pointer hover:underline"
              @click="goToProfile"
            >{{ post.user.name }}</span>
            <span 
              class="text-neutral-500 truncate ml-1 cursor-pointer hover:underline"
              @click="goToProfile"
            >@{{ post.user.handle }}</span>
          </div>
          <span class="text-neutral-500 flex-shrink-0">·</span>
          <span class="text-neutral-500 whitespace-nowrap flex-shrink-0">{{ post.time }}</span>
          
          <!-- Ellipsis Dropdown -->
          <div class="ml-auto relative flex-shrink-0">
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
        <p class="mt-1 text-white text-base cursor-pointer" @click="goToPost">{{ post.content }}</p>

        <!-- Image (optional) -->
        <img 
          v-if="post.image" 
          :src="post.image" 
          class="mt-3 rounded-xl border border-neutral-800 max-h-80 w-full object-cover cursor-pointer"
          @click="goToPost"
        >

        <!-- Actions -->
        <div class="flex justify-between mt-3 text-neutral-500 max-w-md">
          <!-- Fork -->
          <button 
            class="flex items-center gap-1 hover:text-green-500 group"
            @click="goToFork"
          >
            <div class="p-2 rounded-full group-hover:bg-green-500/10">
              <GitBranch class="size-5"/>
            </div>
            <span class="text-sm">{{ post.stats.reposts }}</span>
          </button>

          <!-- Like -->
          <button 
            class="flex items-center gap-1 group"
            :class="post.liked ? 'text-pink-500' : 'hover:text-pink-500'"
            @click="toggleLike"
          >
            <div class="p-2 rounded-full group-hover:bg-pink-500/10">
              <Heart :class="post.liked ? 'fill-current' : ''" class="size-5"/>
            </div>
            <span class="text-sm">{{ post.stats.likes }}</span>
          </button>

          <!-- Share -->
          <button 
            class="flex items-center gap-1 group relative"
            :class="copied ? 'text-green-500' : 'hover:text-blue-400'"
            @click="copyPostLink"
          >
            <div class="p-2 rounded-full group-hover:bg-blue-400/10">
              <Check v-if="copied" class="size-5"/>
              <Share v-else class="size-5"/>
            </div>
            <span v-if="copied" class="text-xs text-green-500">Copied!</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  GitBranch, 
  Heart, 
  Share, 
  Ellipsis,
  Trash2,
  Flag,
  FolderTree,
  Check
} from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { likePost, unlikePost } from '../services/likeService';

const router = useRouter();

const props = defineProps({
  post: {
    type: Object,
    required: true,
    default: () => ({
      id: '1',
      user: {
        id: '1',
        name: 'John Doe',
        handle: 'johndoe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      content: 'This is a sample post content that shows how the card will look with some text in it.',
      time: '2h ago',
      image: '',
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
    default: '1'
  }
});

const emit = defineEmits(['delete', 'like-updated']);

const showDropdown = ref(false);
const copied = ref(false);
const isCurrentUserPost = props.post.user.id === props.currentUserId;

const deletePost = () => {
  if (confirm('Are you sure you want to delete this post?')) {
    emit('delete', props.post.id);
    showDropdown.value = false;
  }
};

const toggleLike = async () => {
  try {
    if (props.post.liked) {
      const result = await unlikePost(props.post.id);
      props.post.liked = false;
      props.post.stats.likes = result.likes;
    } else {
      const result = await likePost(props.post.id);
      props.post.liked = true;
      props.post.stats.likes = result.likes;
    }
    emit('like-updated', props.post.id, props.post.liked);
  } catch (error) {
    console.error('Error toggling like:', error);
  }
};

const goToProfile = () => {
  router.push(`/${props.post.user.handle}`);
};

const goToPost = () => {
  router.push(`/post/${props.post.id}`);
};

const goToFork = () => {
  router.push(`/fork/${props.post.id}`);
};

const copyPostLink = async () => {
  try {
    const postUrl = `${window.location.origin}/post/${props.post.id}`;
    await navigator.clipboard.writeText(postUrl);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Error copying link:', error);
  }
};
</script>