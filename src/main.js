import { createApp } from 'vue'
import './style.css'
import './assets/css/flipclock.css'
import './style.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import SvgIcon from './components/SvgIcon.vue'
import './assets/iconfont/iconfont.js'
import './assets/js/flipclock'
import api from '@/api/index'
import { createPinia } from 'pinia'

const app = createApp(App)

app.component('SvgIcon', SvgIcon)

app.config.globalProperties.$api = api

app.use(createPinia()).use(ElementPlus).use(router).mount('#app')
