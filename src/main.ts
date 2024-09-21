import './assets/main.css'

import { type ComponentPublicInstance, createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import errorHandler from '@/components/ErrorHandler.vue'
import { useErrorStore } from '@/stores/error'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// // Application level error handling
// const errorStore = useErrorStore();
// app.config.errorHandler =
//   (err: unknown, instance: ComponentPublicInstance | null, info: string): void => {
//     console.error('Error:', err);
//     console.error('Component:', instance);
//     console.error('Info:', info);
//
//     errorStore.setError(err);
//     errorStore.setInstance(instance);
//     errorStore.setInfo(info ?? '');
//   }

app.mount('#app')
