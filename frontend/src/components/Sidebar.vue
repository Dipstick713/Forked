<script setup>
import { RouterLink } from 'vue-router';
import { 
  House,
  FolderGit2,
  Users,
  User,
  GitFork,
  LogOut 
 } from 'lucide-vue-next';
const logout = () => {
  // Add your logout logic here
  console.log('Logging out...')
}
</script>


<template>
  <aside class="w-80 p-6 flex flex-col justify-between border-r border-[#253344]">
    <div class="font-roboto">
      <h2 class="flex text-2xl font-bold h-25">
        <GitFork class="mx-2"/>
        Forked</h2>
      <nav class="space-y-12 pt-30 text-xl text-neutral-300">
        <RouterLink to="/" class="flex w-35 space-y-5 hover:text-white rounded-full h-12 items-center hover:bg-zinc-800 transition-colors duration-200"><House class="mx-4"/>Home</RouterLink>
        <a href="#" class="flex w-46 space-y-5 hover:text-white rounded-full h-12 items-center hover:bg-zinc-800 transition-colors duration-200"><FolderGit2 class="mx-4"/>New Posts</a>
        <RouterLink 
  to="/user/followers" 
  class="flex w-45 space-y-5 hover:text-white rounded-full h-12 items-center hover:bg-zinc-800 transition-colors duration-200"
>
  <Users class="mx-4"/>
  Followers
</RouterLink>

<RouterLink 
  to="/user/following" 
  class="flex w-45 space-y-5 hover:text-white rounded-full h-12 items-center hover:bg-zinc-800 transition-colors duration-200"
>
  <Users class="mx-4"/>
  Following
</RouterLink>
        <a href="#" class="flex w-37 space-y-5 hover:text-white rounded-full h-12 items-center hover:bg-zinc-800 transition-colors duration-200"> <User class="mx-4"/>Profile</a>
      </nav>
    </div>

    <!-- User Profile Section -->
    <div class="flex items-center justify-between p-3 rounded-lg transition cursor-pointer">
      <div class="flex items-center space-x-3">
        <img 
          src="https://randomuser.me/api/portraits/men/1.jpg" 
          class="w-10 h-10 rounded-full object-cover border border-neutral-600"
          alt="User avatar"
        >
        <div class="space-y-1">
          <p class="font-medium text-white">John Doe</p>
          <p class="text-sm text-neutral-400">john@example.com</p>
        </div>
      </div>
      <button 
        class="text-neutral-400 pb-5 hover:text-red-500 rounded-full transition"
        @click="logout"
      >
        <LogOut/>
      </button>
    </div>
  </aside>
</template>

