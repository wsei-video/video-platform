import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { vTooltip } from '@/directives'

import 'bootstrap'
import './styles/main.scss'

const app = createApp(App)

app.directive('tooltip', vTooltip)

app.use(createPinia())
app.use(router)

app.mount('#app')
