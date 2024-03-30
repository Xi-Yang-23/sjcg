import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

/**
 * 数据模拟
 * ! 如果使用真实数据请把mock注释掉
 * @return {Object,Array}  
 */
import './mock/home.js'

const app = createApp(App)

// Quasar组件
import { quasarLang, Quasar, Notify, Dialog, LoadingBar } from './assets/quasar.js'

app.use(Quasar, {
  // import Quasar plugins and add here
  plugins: {
    Notify, Dialog, LoadingBar
  },
  lang: quasarLang,

})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(router)
app.mount('#app') 
