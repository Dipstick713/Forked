<template>
  <div class="p-4 border-b border-neutral-800 transition-colors duration-200" :class="{ 'hover:bg-[#181a1d] cursor-pointer': !post.deleted }" @click="post.deleted ? null : goToPost()">
    <!-- Deleted Post State -->
    <div v-if="post.deleted" class="text-neutral-500 italic py-2">
      This post was deleted
    </div>

    <!-- Normal Post -->
    <div v-else class="flex gap-3">
      <!-- Avatar -->
      <img 
        :src="post.user.avatar" 
        class="w-12 h-12 rounded-full object-cover border border-neutral-700 flex-shrink-0 cursor-pointer hover:opacity-90 transition"
        alt="User avatar"
        @click.stop="goToProfile"
      >

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- Header -->
        <div class="flex items-center gap-1 text-sm">
          <div class="flex items-baseline min-w-0 max-w-[calc(100%-40px)]">
            <span 
              class="font-bold text-white truncate max-w-[120px] cursor-pointer hover:underline"
              @click.stop="goToProfile"
            >{{ post.user.name }}</span>
            <span 
              class="text-neutral-500 truncate ml-1 cursor-pointer hover:underline"
              @click.stop="goToProfile"
            >@{{ post.user.handle }}</span>
          </div>
          <span class="text-neutral-500 flex-shrink-0">·</span>
          <span class="text-neutral-500 whitespace-nowrap flex-shrink-0">{{ post.time }}</span>
          
          <!-- Ellipsis Dropdown -->
          <div class="ml-auto relative flex-shrink-0">
            <button 
              @click.stop="showDropdown = !showDropdown"
              class="text-neutral-500 hover:text-white p-2 rounded-full hover:bg-zinc-800"
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
                  @click.stop="deletePost"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-neutral-800"
                >
                  <Trash2 class="w-4 h-4 mr-2"/>
                  Delete Post
                </button>
                
                <!-- Other options can be added here -->
                <button
                  @click.stop
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
          <!-- Fork -->
          <button 
            class="flex items-center gap-1 hover:text-green-500 group"
            @click.stop="goToFork"
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
            @click.stop="toggleLike"
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
            @click.stop="copyPostLink"
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

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      :show="showDeleteDialog"
      title="Delete Post?"
      message="This will mark your post as deleted. The post will remain visible in threads to preserve context, but will show as '[deleted]'."
      confirmText="Delete"
      @confirm="confirmDelete"
      @cancel="showDeleteDialog = false"
    />
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
import { postService } from '../services/postService';
import ConfirmDialog from './ConfirmDialog.vue';

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
const showDeleteDialog = ref(false);
const copied = ref(false);
const isCurrentUserPost = props.post.user.id === props.currentUserId;

const deletePost = () => {
  showDropdown.value = false;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  try {
    await postService.deletePost(props.post.id);
    showDeleteDialog.value = false;
    emit('delete', props.post.id);
    
    // Mark post as deleted in UI
    props.post.deleted = true;
    props.post.content = '[deleted]';
    props.post.image = '';
  } catch (error) {
    console.error('Error deleting post:', error);
    alert('Failed to delete post. Please try again.');
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
  router.push(`/${props.post.id}/forks`);
};

const goToFork = () => {
  router.push(`/fork/${props.post.id}`);
};

const copyPostLink = async () => {
  try {
    const postUrl = `${window.location.origin}/${props.post.id}/forks`;
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