const routes = [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('@/pages/transactions/TransactionsList.vue') },
        { path: '/import', name: 'import', component: () => import('@/pages/data/ImportTransactions.vue') },
        { path: '/export', name: 'export', component: () => import('@/pages/data/ExportTransactions.vue') },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/pages/AboutView.vue'),
        },
        {
          path: '/test',
          name: 'test',
          component: () => import('@/pages/TestPage.vue'),
        },
        {
          name: 'create',
          path: 'transaction/create',
          component: () => import('@/pages/transactions/TransactionForm.vue'),
        },
        {
          name: 'clone',
          path: 'transaction/:id/clone',
          component: () => import('@/pages/transactions/TransactionForm.vue'),
        },
        {
          name: 'update',
          path: 'transaction/:id/update',
          component: () => import('@/pages/transactions/TransactionForm.vue'),
        },
        // {
        //   path: '/add-transaction',
        //   name: 'add-transaction',
        //   component: () => import('@/pages/transactions/AddTransaction.vue'),
        // },
        {
          path: '/transaction-details/:id',
          name: 'transaction-details',
          component: () => import('@/pages/transactions/TransactionDetails.vue'),
        },
        {
          path: '/transactions-by-tag/:id',
          name: 'transactions-by-tag',
          component: () => import('@/pages/transactions/TransactionsByTag.vue'),
        },
  
        {
          path: '/tags',
          name: 'tags',
          component: () => import('@/pages/tags/TagsList.vue'),
        },
        {
          path: '/create-tag',
          name: 'create-tag',
          component: () => import('@/pages/tags/TagForm.vue'),
        },
        {
          path: '/tag-details/:id',
          name: 'tag-details',
          component: () => import('@/pages/tags/TagDetails.vue'),
        },
        {
          path: '/charts',
          name: 'charts',
          component: () => import('@/pages/charts/ChartsPage.vue'),
        },
        {
          path: '/apex-charts',
          name: 'apex-charts',
          component: () => import('@/pages/charts/ApexChartsPage.vue'),
        },
      ],
    },
  
    // Always leave this as last one,
    // but you can also remove it
    {
      path: '/:catchAll(.*)*',
      component: () => import('@/pages/ErrorNotFound.vue'),
    },
  ]
  
  export default routes
  