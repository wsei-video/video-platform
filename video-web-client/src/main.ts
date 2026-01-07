import 'bootstrap'
import './styles/main.scss'

import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp, devtools } from 'vue'

import { vClickGuard, vClickOutside, vMaxLines, vShowable, vTooltip } from '@/directives'
import { router } from '@/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
})

import App from './App.vue'

const app = createApp(App)

app.directive('click-outside', vClickOutside)
app.directive('showable', vShowable)
app.directive('tooltip', vTooltip)
app.directive('max-lines', vMaxLines)
app.directive('click-guard', vClickGuard)

app.use(createPinia())
app.use(VueQueryPlugin, { queryClient, devtools })
app.use(router)

app.mount('#app')
