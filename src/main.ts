import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import message from '@/components/prompt';

createApp(App)
.use(message)
.use(store).use(router).mount('#app')
