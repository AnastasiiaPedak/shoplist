import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import { VueFire } from 'vuefire'
import { firebaseApp } from './firebase'

const pinia = createPinia()
const app = createApp(App)

app.use(VueFire, { firebaseApp })
app.use(pinia)
app.mount('#app')
