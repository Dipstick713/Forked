import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PostView from '@/views/PostView.vue'
import ProfileView from '@/views/ProfileView.vue'
import FollowView from '@/views/FollowView.vue'
import NewPostView from '@/views/NewPostView.vue'
import ForksView from '@/views/ForksView.vue'
import ForkPostView from '@/views/ForkPostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostView,
    },
    {
      path: '/fork/:id',
      name: 'forkpost',
      component: ForkPostView,
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
      path: '/:post/forks',
      name: 'forks',
      component: ForksView
    },
    {
      path: '/:user',
      name: 'profile',
      component: ProfileView
    }
  ],
})

export default router