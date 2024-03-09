import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'



const routes = [
  // 首页
  {
    path: '/home',
    component: HomeView,
    children: [
      {
        path: '',
        name: 'home',
        alias: '/',
        component: () => import('../views/home/TuiJianView.vue'),
      },


      {
        path: 'music',
        component: () => import('../views/home/musicView.vue'),
      },
      {
        path: 'hd',
        component: () => import('../views/home/HdView.vue'),
      },
      {
        path: 'qd',
        component: () => import('../views/home/QdView.vue'),
      },
    ]
  },

  // 用户
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/UsersView.vue')
  },

  // 管理
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue')
  },

  // 审核
  {
    path: '/yesgo',
    name: 'ysego',
    component: () => import('../views/YesView.vue')
  },

  // 文章编辑
  {
    path: '/article/ctedit',
    name: 'articleEdit',
    component: () => import('../components/articleEdit.vue')
  },


  // 404
  { path: '/:pathMatch(.*)*', name: '404', component: import('../views/404.vue') },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
})

export default router
