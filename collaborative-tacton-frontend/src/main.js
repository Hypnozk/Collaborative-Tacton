import { createApp } from 'vue'
import App from './renderer/App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from "./renderer/router"
import { useStore } from "./renderer/store/store";

loadFonts()

createApp(App)
  .use(vuetify)
  .use(useStore())
  .use(router)
  .mount('#app')
