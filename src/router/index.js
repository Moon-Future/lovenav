import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Layout from '@/layouts/Layout.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home/Home.vue'),
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/bookmark',
        name: 'Bookmark',
        component: () => import(/* webpackChunkName: "bookmark" */ '@/views/Bookmark/Bookmark.vue'),
      },
    ],
  },
  {
    path: '/clock',
    name: 'Clock',
    component: () => import(/* webpackChunkName: "clock" */ '@/views/Clock/Clock.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(), // HTML5模式
  routes,
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
