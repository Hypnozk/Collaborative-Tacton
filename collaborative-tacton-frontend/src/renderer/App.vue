<template>
  <div tabindex="0" class="main" @keyup="buttonUp" @keydown="buttonDown">
    <div class="root">
      <v-app>
        <v-main>
          <router-view />
        </v-main>
      </v-app>
    </div>
    <button @click="temp">tesztin</button>
    <transition name="fade">
      <div id="snackbar" v-show="!count">Some text some message..</div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.main {
  height: 100%;
  outline: none;
  justify-content: center;
  display: flex;
}
.root {
  display: block;
  width: 100%;
}
.customSnackbar {
  background-color: aquamarine;
}
#snackbar {
  width: 90%; /* Set a default minimum width */
  box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
  border-radius: 5px !important;
  // box-shadow: #333;
  background-color: #333; /* Black background color */
  color: #fff; /* White text color */
  text-align: center; /* Centered text */
  border-radius: 2px; /* Rounded borders */
  padding: 16px; /* Padding */
  margin: 16px; /* Padding */
  position: fixed; /* Sit on top of the screen */
  z-index: 1; /* Add a z-index if needed */
  bottom: 30px; /* 30px from the bottom */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.9s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core";
import { RouterNames } from "../types/Routernames";
import { GeneralSettingsActionTypes } from "./store/modules/generalSettings/generalSettings";
import { useStore, store } from "./store/store";
import {sendMessage} from "./WebSocketManager"
export default defineComponent({
  name: "App",
  setup() {
    const store = useStore();
    return {
      isConnected: computed(() => store.getters.isConnectedToSocket),
    };
  },
  data() {
    return {
      //isConnected: false,
      store: useStore(),
      snackbar: true,
    };
  },
  computed: {
    count() {
      console.log("count " + store.getters.isConnectedToSocket)
      return store.getters.isConnectedToSocket;
    },
  },
  mounted() {
    console.log("get mounted");
  },
  watch: {
    $route(to) {
      //this.show = false;
      this.store.dispatch(
        GeneralSettingsActionTypes.changeCurrentView,
        to.name
      );
    },
  },
  methods: {
    temp() {
      console.log("temp count" + this.count)
      console.log(this.isConnected);
      //
      sendMessage();
    },
    correctFrameForInput(): boolean {
      return this.store.getters.currentView !== RouterNames.PLAY_GROUND;
    },
    buttonDown(e: any) {
      // console.log(this.store.state.directInput.globalIntensity)
      console.log("buttondd");
      const key: string = e.key.toUpperCase();
      if (this.correctFrameForInput()) return;

      console.log("buttondd");
      // this.store.dispatch(ActionTypes.addActiveKey, key);
    },
    buttonUp(e: any) {
      const key = e.key.toUpperCase();
      if (this.correctFrameForInput()) return;

      console.log("buttonUp");
      //this.store.dispatch(ActionTypes.removeActiveKey, key);
    },
  },
});
</script>
