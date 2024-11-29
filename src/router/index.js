import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../layouts/MainLayout.vue"),
      children: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
        { path: '/tags', name: 'tags', component: () => import('../views/TagsView.vue') },
        { path: '/transaction-details/:id', name: 'transaction-details', component: () => import('../views/TransactionDetailsView.vue') },
        { path: '/tag-details/:id', name: 'tag-details', component: () => import('../views/TagDetailsView.vue') },
      ]
    },
    {
      path: "/forms",
      component: () => import("../layouts/AddTransactionLayout.vue"),
      children: [
        { path: '/add-expense', name: 'add-expense', component: () => import('../views/AddTransactionView.vue') },
      ]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
