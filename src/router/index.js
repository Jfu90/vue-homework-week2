import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeWork.vue')
    },
    {
      path: '/homework',
      component: () => import('../views/HomeWork.vue')
    }
  ]
})

export default router
