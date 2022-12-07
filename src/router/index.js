import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Layout from '@/layouts/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home/Home.vue'),
      },
      {
        path: '/bookmark',
        name: 'Bookmark',
        component: () => import(/* webpackChunkName: "bookmark" */ '@/views/Bookmark/Bookmark.vue'),
      },
    ],
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
