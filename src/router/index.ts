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
      path: '/webxr',
      name: 'webxr',
      component: () => import('../views/WebXRView.vue')
    },
    // {
    //   path: '/webxr-sample',
    //   name: 'webxr-sample',
    //   component: () => import('../views/WebXRSampleView.vue')
    // },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: () => import('../views/WebXrTutorial.vue')
    }
  ]
})

export default router
