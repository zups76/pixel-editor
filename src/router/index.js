import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/maker',
      name: 'ImageMaker',
      component: () => import('../views/ImageMaker.vue')
    },
    {
      path: '/layer',
      name: 'ImageMakerLayer',
      component: () => import('../views/ImageMakerLayer.vue')
    },
    {
      path: '/PixelEditor',
      name: 'PixelEditor',
      component: () => import('../views/PixelEditor.vue')
    },
    {
      path: '/CanvasRotate',
      name: 'CanvasRotate',
      component: () => import('../views/CanvasRotate.vue')
    },
  ]
})

export default router
