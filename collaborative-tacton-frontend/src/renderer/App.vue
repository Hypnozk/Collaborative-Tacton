<template>
  <div tabindex="0" class="main" @keyup="buttonUp" @keydown="buttonDown">
    <v-app>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>

<style>

.main {
  height: 100%;
  outline: none;
}
</style>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { RouterNames } from "./router/routes";
import { ActionTypes } from "./store/modules/directInput/actionTypes";
import { ActionTypes as ActionTypesViewPort } from "./store/modules/viewPort/viewPort";
import { useStore } from "./store/store";
export default defineComponent({
  name: "App",
  data() {
    return {
      store: useStore(),
    };
  },
  watch: {
    $route(to) {
      //this.show = false;
      this.store.dispatch(ActionTypesViewPort.changeCurrentView, to.name);
    },
  },
  methods: {
    correctFrameForInput(): boolean {
      return this.store.getters.currentView == RouterNames.PLAY_GROUND;
    },
    buttonDown(e: any) {
      const key: string = e.key.toUpperCase();
      if (this.correctFrameForInput())
        return;

      console.log("buttondd");
      this.store.dispatch(ActionTypes.addActiveKey, key);
    },
    buttonUp(e: any) {
      const key = e.key.toUpperCase();
      if (
        this.correctFrameForInput()
      )
        return;

      console.log("buttonUp");
      this.store.dispatch(ActionTypes.removeActiveKey, key);
    },
  },
});
</script>