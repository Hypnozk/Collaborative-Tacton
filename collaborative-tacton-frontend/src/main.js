import { createApp } from 'vue'
import App from './renderer/App.vue'
import router from "./renderer/router"
import { store } from "./renderer/store/store";
import { IPC_CHANNELS } from './electron/IPCManager/IPCChannels';

const registerListener = () => {
  window.api.receive(IPC_CHANNELS.receive.actuator, (arg) => {
    console.log("Get from main " + arg); // prints "pong"
  });
}
// import global modules
import globalComponents from "./renderer/components/centralComponents/base/_globals.js";

// create vue app
const app = createApp(App);

// set router and store
app.use(store);
app.use(router);

// register global components
globalComponents(app);

registerListener()
// mount the app
app.mount('#app');
