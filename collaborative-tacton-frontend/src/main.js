import { createApp } from 'vue';
import App from './renderer/App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from "./renderer/router";
import { useStore } from "./renderer/store/store";
import { initWebsocket } from "./renderer/CommunicationManager/WebSocketManager";
import { initIPCListener } from "./renderer/CommunicationManager/IPCListener";
import { initConfig } from "./renderer/CommunicationManager/FileManager";

const temp = {

  channels: [1],
  color: "#0693E3",
  h: 1,
  id: "uuidv4()",
  intensity: 1,
  key: "A",

  w: 1,
  x: 1,
  y: 1,
  isActive: false
}
console.log(temp)

loadFonts()

createApp(App)
  .use(vuetify)
  .use(useStore())
  .use(router)
  .mount('#app')

initIPCListener();
initWebsocket();
initConfig();