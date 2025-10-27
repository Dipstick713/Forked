import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import FollowView from '@/views/FollowView.vue'
import NewPostView from '@/views/NewPostView.vue'
import ForksView from '@/views/ForksView.vue'
import ForkPostView from '@/views/ForkPostView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/fork/:id',
      name: 'forkpost',
      component: ForkPostView,
    },
    {
      path: '/:id/forks',
      name: 'forks',
      component: ForksView
    },
    {
      path: '/:user/followers',
      name: 'followers',
      component: FollowView
    },
    {
      path: '/:user/following',
      name: 'following',
      component: FollowView
    },
    {
      path: '/:user/newpost',
      name: 'newpost',
      component: NewPostView
    },
    {
      path: '/:user',
      name: 'profile',
      component: ProfileView
    }
  ],
})

export default router