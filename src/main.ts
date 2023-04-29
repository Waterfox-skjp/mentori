import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import veProgress from 'vue-ellipse-progress'
import { createVfm } from 'vue-final-modal'
import 'vue-final-modal/style.css'
import 'material-icons/iconfont/material-icons.css'

// service workerの登録
import { registerSW } from 'virtual:pwa-register';
registerSW();

const app = createApp(App)
const vfm = createVfm()
app.use(router)
app.use(veProgress)
app.use(vfm)
app.mount('#app')
