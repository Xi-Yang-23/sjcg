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
// import './mock/home.js'

const app = createApp(App)

// Quasar组件
import { quasarLang, Quasar, Notify } from './assets/quasar.js'

app.use(Quasar, {
  plugins: {
    Notify,
  }, // import Quasar plugins and add here
  lang: quasarLang,
  config: {


    // screen: {
    //   bodyClasses: true // <<< add this
    // }  

    // brand: {
    //   // primary: '#e46262',
    //   // ... or all other brand colors
    // },
    // notify: {...}, // default set of options for Notify Quasar plugin
    // loading: {...}, // default set of options for Loading Quasar plugin
    // loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more (check Installation card on each Quasar component/directive/plugin)
  }
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(router) 
app.mount('#app') 
