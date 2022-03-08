import { createApp } from 'vue'
import App from './App.vue'
import router from "./renderer/router";
import store from "./renderer/store/store";

// import global modules
import globalComponents from "./renderer/components/centralComponents/base/_globals.js";

// create vue app
const app = createApp(App);

// set router and store
app.use(store);
app.use(router);

// register global components
globalComponents(app);

// mount the app
app.mount('#app');
