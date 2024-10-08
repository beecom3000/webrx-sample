import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WebXRBabylonView from '@/views/WebXRBabylonView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WebXRBabylonView
    },
    {
      path: '/piano',
      name: 'piano',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/PianoView.vue')
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // },
    // {
    //   path: '/webxr',
    //   name: 'webxr',
    //   component: () => import('../views/WebXRView.vue')
    // },
    {
      path: '/portal',
      name: 'portal',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/PortalView.vue')
    },
    // {
    //   path: '/webxr-sample',
    //   name: 'webxr-sample',
    //   component: () => import('../views/WebXRSampleView.vue')
    // },
    // {
    //   path: '/tutorial',
    //   name: 'tutorial',
    //   component: () => import('../views/WebXrTutorial.vue')
    // },
    // {
    //   path: '/babylon',
    //   name: 'babylon',
    //   component: () => import('../views/WebXRBabylonView.vue')
    // }
  ]
})

export default router
