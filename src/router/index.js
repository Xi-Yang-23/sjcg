import { createRouter, createWebHistory } from 'vue-router'
import layOutStateStore from '../stores/layoutState'
import { Screen } from 'quasar'
import musicStore from "../stores/musicStore";



const routes = [
  {
    path: '/',
    redirect: 'home',
  },

  // 首页
  {
    path: '/home',
    alias: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    // children: [
    //   {
    //     path: '',
    //     name: 'home',

    //   },


    //   {
    //     path: 'music',
    //     component: () => import('../views/home/musicView.vue'),
    //   },
    //   {
    //     path: 'hd',
    //     component: () => import('../views/home/HdView.vue'),
    //   },
    //   {
    //     path: 'qd',
    //     component: () => import('../views/home/QdView.vue'),
    //   },
    // ]
  },

  // 发现
  {
    path: '/faxian',
    name: 'faxian',
    component: () => import('../views/FaXianView.vue'),
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
  const useMusicStore = musicStore();

  const { name } = to
  // 文章编辑
  if (name === 'articleEdit') {
    useLayOutStateStore.homeHeader = false
    useLayOutStateStore.homeFooter = false
  }


  // 视频界面
  if (name === 'video') {
    useLayOutStateStore.homeHeader = false
    useLayOutStateStore.homeFooter = false
    if (Screen.gt.xs) useMusicStore.miniOffset = [0, 50]
  }

  // 首页
  if (name === 'home' || name === 'ysego' || name === 'admin' || name === 'users') {
    useLayOutStateStore.homeHeader = true
    useLayOutStateStore.homeFooter = true
  }

  if (Screen.xs) {
    if (name === 'faxian') useMusicStore.miniOffset = [0, 0]
  } else {
    if (name === 'faxian' || name === 'users') useMusicStore.miniOffset = [0, 50]
    if (name === 'home') useMusicStore.miniOffset = [0, 0]
  }


})

export default router
