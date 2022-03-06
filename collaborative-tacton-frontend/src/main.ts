import { createApp } from "vue";
import App from "./App.vue";
import router from "./renderer/router";
import store from "./renderer/store";

createApp(App).use(store).use(router).mount("#app");
