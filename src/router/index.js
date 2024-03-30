import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import layOutStateStore from '../stores/layoutState'



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
    path: '/users/:uid?',
    name: 'users',
    component: () => import('../views/UsersView.vue')
  },

  // 管理
  {
    path: '/admin/:uid?',
    name: 'admin',
    component: () => import('../views/AdminView.vue')
  },

  // 审核
  {
    path: '/yesgo/:uid?',
    name: 'ysego',
    component: () => import('../views/YesView.vue')
  },

  // 视频页面
  {
    path: '/video/:uid?',
    name: 'video',
    component: () => import('../views/VideoView.vue')
  },


  // 文章编辑
  {
    // path: '/article/ctedit/:uid?',
    path: '/articlesedit/:uid?',
    name: 'articleEdit',
    component: () => import('../views/ArticleEditView.vue')
  },


  // 404
  // { path: '/:pathMatch(.*)*', name: '404', component: import('../views/404.vue') },
  { path: '/:pathMatch(.*)', name: '404', component: import('../views/404.vue') }
]
const router = createRouter({
  // history: createWebHistory(),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const useLayOutStateStore = layOutStateStore()
  const { name } = to
  // 文章编辑
  if (name === 'articleEdit') {
    useLayOutStateStore.homeHeader = false
    useLayOutStateStore.homeFooter = false
    useLayOutStateStore.dreaws = false
  }


  // 视频界面
  if (name === 'video') {
    useLayOutStateStore.homeHeader = false
    useLayOutStateStore.homeFooter = false
    useLayOutStateStore.dreaws = false
  }

  // 首页
  if (name === 'home' || name === 'ysego' || name === 'admin' || name === 'users') {
    useLayOutStateStore.homeHeader = true
    useLayOutStateStore.homeFooter = true
    useLayOutStateStore.dreaws = true
  }


})

export default router
