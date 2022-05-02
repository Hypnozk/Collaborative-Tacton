<template>
  <div tabindex="0" class="main" @keyup="buttonUp" @keydown="buttonDown">
    <div class="root">
    <v-app>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
    </div>
    <transition name="fade">
      <div id="snackbar" v-show="snackbar">Some text some message..</div>
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
.root{
  display: block;
  width: 100%;
}
.customSnackbar {
  background-color: aquamarine;
}
#snackbar {
  width: 90%; /* Set a default minimum width */
  box-shadow:0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
  border-radius: 5px  !important;
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
import { defineComponent } from "@vue/runtime-core";
import { RouterNames } from "../types/Routernames";
import { ActionTypes } from "./store/modules/directInput/actionTypes";
import { ActionTypes as ActionTypesGeneral } from "./store/modules/generalSettings/generalSettings";
import { useStore } from "./store/store";
export default defineComponent({
  name: "App",
  data() {
    return {
      store: useStore(),
      snackbar: true,
    };
  },
  mounted() {
    console.log("get mounted");
    this.store.dispatch(ActionTypesGeneral.addSocketClient);
  },
  watch: {
    $route(to) {
      //this.show = false;
      this.store.dispatch(ActionTypesGeneral.changeCurrentView, to.name);
    },
  },
  methods: {
    correctFrameForInput(): boolean {
      return this.store.getters.currentView !== RouterNames.PLAY_GROUND;
    },
    buttonDown(e: any) {
       console.log("buttondd");
      const key: string = e.key.toUpperCase();
      if (this.correctFrameForInput()) return;

      console.log("buttondd");
      this.store.dispatch(ActionTypes.addActiveKey, key);
    },
    buttonUp(e: any) {
      const key = e.key.toUpperCase();
      if (this.correctFrameForInput()) return;

      console.log("buttonUp");
      this.store.dispatch(ActionTypes.removeActiveKey, key);
    },
  },
});
</script>
