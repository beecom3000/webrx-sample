import './assets/main.css'

import { type ComponentPublicInstance, createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import errorHandler from '@/components/ErrorHandler.vue'

const app = createApp(App)

// Application level error handling
app.config.errorHandler =
  (err: unknown, instance: ComponentPublicInstance | null, info: string): void => {
  console.error('Error:', err);
  console.error('Component:', instance);
  console.error('Info:', info);
}

app.use(createPinia())
app.use(router)

app.mount('#app')
