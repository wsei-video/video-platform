import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { router } from '@/router'
import App from './App.vue'

import { vClickOutside, vShowable, vTooltip } from '@/directives'

import 'bootstrap'
import './styles/main.scss'

const app = createApp(App)

app.directive('click-outside', vClickOutside)
app.directive('showable', vShowable)
app.directive('tooltip', vTooltip)

app.use(createPinia())
app.use(router)

app.mount('#app')
