import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PostView from '@/views/PostView.vue'
import ProfileView from '@/views/ProfileView.vue'
import FollowView from '@/views/FollowView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/post',
      name: 'post',
      component: PostView,
    },
    {
      path: '/user/followers',
      name: 'followers',
      component: FollowView
    },
    {
      path: '/user/following',
      name: 'following',
      component: FollowView
    },
    {
      path: '/:user',
      name: 'profile',
      component: ProfileView
    }
  ],
})

export default router