<script setup>
import { RouterLink } from 'vue-router';
import { 
  House,
  FolderGit2,
  Users,
  User,
  GitFork,
  LogOut,
  LogIn
} from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { authService } from '@/services/auth';

const user = ref(null);
const isLoading = ref(true);

// Check if user is logged in on component mount
onMounted(async () => {
  try {
    const response = await authService.getCurrentUser();
    user.value = response.user;
  } catch (error) {
    console.error('Error checking auth status:', error);
  } finally {
    isLoading.value = false;
  }
});

const login = () => {
  authService.loginWithGitHub();
};

const logout = async () => {
  try {
    const success = await authService.logout();
    if (success) {
      user.value = null;
      // Redirect to home page after logout
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>

<template>
  <aside class="w-80 p-6 flex flex-col justify-between border-r border-[#253344]">
    <div>
      <h2 class="flex text-2xl font-bold h-25">
        <GitFork class="mx-2"/>
        Forked
      </h2>
      
      <nav v-if="user" class="space-y-12 pt-30 text-xl text-neutral-300">
        <RouterLink to="/" class="flex w-35 space-y-5 hover:text-white rounded-full h-12 items-center hover:bg-zinc-800 transition-colors duration-200">
          <House class="mx-4"/>Home
        </RouterLink>
        <RouterLink :to="`/${user.username}/newpost`" class="flex w-46 space-y-5 hover:text-white rounded-full h-12 items-center hover:bg-zinc-800 transition-colors duration-200">
          <FolderGit2 class="mx-4"/>New Posts
        </RouterLink>
        <RouterLink :to="`/${user.username}/followers`" class="flex w-45 space-y-5 hover:text-white rounded-full h-12 items-center hover:bg-zinc-800 transition-colors duration-200">
          <Users class="mx-4"/>Followers
        </RouterLink>
        <RouterLink :to="`/${user.username}/following`" class="flex w-45 space-y-5 hover:text-white rounded-full h-12 items-center hover:bg-zinc-800 transition-colors duration-200">
          <Users class="mx-4"/>Following
        </RouterLink>
        <RouterLink :to="`/${user.username}`" class="flex w-37 space-y-5 hover:text-white rounded-full h-12 items-center hover:bg-zinc-800 transition-colors duration-200">
          <User class="mx-4"/>Profile
        </RouterLink>
      </nav>

      <!-- Show login prompt when not authenticated -->
      <div v-else class="space-y-12 pt-30 text-xl text-neutral-300">
        <RouterLink to="/" class="flex w-35 space-y-5 hover:text-white rounded-full h-12 items-center hover:bg-zinc-800 transition-colors duration-200">
          <House class="mx-4"/>Home
        </RouterLink>
        <div class="p-4 text-center text-neutral-400">
          Login to access all features
        </div>
      </div>
    </div>

    <!-- User Profile Section -->
    <div v-if="isLoading" class="flex items-center justify-center p-3">
      <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="user" class="flex items-center justify-between p-3 rounded-lg transition cursor-pointer">
      <div class="flex items-center space-x-3">
        <img 
          :src="user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`" 
          class="w-10 h-10 rounded-full object-cover border border-neutral-600"
          :alt="user.displayName"
        >
        <div class="space-y-1">
          <p class="font-medium text-white">{{ user.displayName || user.username }}</p>
          <p class="text-sm text-neutral-400">@{{ user.username }}</p>
        </div>
      </div>
      <button 
        class="text-neutral-400 pb-5 hover:text-red-500 rounded-full transition"
        @click="logout"
        title="Logout"
      >
        <LogOut/>
      </button>
    </div>

    <!-- Login Button when not authenticated -->
    <div v-else class="flex items-center justify-center p-3">
      <button 
        @click="login"
        class="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-200"
      >
        <LogIn class="w-5 h-5"/>
        <span>Login with GitHub</span>
      </button>
    </div>
  </aside>
</template>

