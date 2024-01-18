import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import { VueFire } from 'vuefire'
import { firebaseApp } from './firebase'

const pinia = createPinia()
const app = createApp(App)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
  .then(function(registration) {
    console.log('Service Worker registered with scope:', registration.scope);
  })
  .catch(function(error) {
    console.log('Service Worker registration failed:', error);
  });
}

app.use(VueFire, { firebaseApp })
app.use(pinia)
app.mount('#app')
