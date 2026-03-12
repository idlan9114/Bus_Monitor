import { createRouter, createWebHistory } from 'vue-router'
import BusDashboard from '../views/BusDashboard.vue'
import Main from '../views/Main.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
    },
    {
      path: '/BusDashboard',
      name: 'BusDashboard',
      component: BusDashboard,
    },
    
  ],
})

export default router
