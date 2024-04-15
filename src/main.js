import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

// Quasar组件
import './assets/quasar.js'
import quasarLang from 'quasar/lang/zh-CN'
import { Quasar, Notify, Dialog, LoadingBar, BottomSheet,Loading } from 'quasar'
// import { read } from 'jsmediatags'
// import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js?raw'
// console.log(jsmediatags() );
// await import("jsmediatags/dist/jsmediatags.min.js")
// console.log(jsmediatags);


/**
 * 数据模拟
 * ! 如果使用真实数据请把mock注释掉
 * @return {Object,Array}  
 */
import './mock/home.js'

const app = createApp(App)



app.use(Quasar, {
  // import Quasar plugins and add here
  plugins: {
    Notify, Dialog, LoadingBar, BottomSheet,Loading
  },
  lang: quasarLang,

})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(router)
app.mount('#app') 
