import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// service workerの登録
import { registerSW } from 'virtual:pwa-register';
registerSW();

createApp(App).mount('#app')
