<template>
  <div tabindex="0" class="main" @keyup="buttonUp" @keydown="buttonDown">
    <nav>
      <router-link to="/devices">Devices</router-link> |
      <router-link to="/">Play Ground</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
.main {
  height: 100%;
  outline: none;
}

nav {
  display: flex;
  padding-top: 10px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  padding-right: 10px;
  padding-left: 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { RouteNames } from "./renderer/router/routes";
import { ActionTypes } from "./renderer/store/modules/directInput/directInput";
import { ActionTypes as ActionTypesViewPort } from "./renderer/store/modules/viewPort/viewPort";
import {useStore} from "./renderer/store/store"
export default defineComponent({
  name: "App",
    data() {
    return {
      store: useStore(),
    }
  },
  watch: {
    $route(to) {
      //this.show = false;
      this.store.dispatch(
        ActionTypesViewPort.changePlayGroundVisible,
        to.name == RouteNames.PLAY_GROUND
      );
    },
  },
  methods: {
    correctFrameForInput(): boolean {
      return (
        this.store.getters.playGroundVisible ||
        !this.store.getters.editModeActive
      );
    },
    buttonDown(e: any) {
      const key: string = e.key.toUpperCase();
      if (
        !this.correctFrameForInput ||
        this.store.getters.keyAlreadyActive(key)
      )
        return;
      const item = this.store.getters.gridLayout.find(
        (item: any) => item.key.toUpperCase() === key
      );
      if (item) {
        // activateChannels(item.channels, item.intensity);
        this.store.dispatch(ActionTypes.addActiveKey, key);
      }
    },
    buttonUp(e: any) {
      const key = e.key.toUpperCase();
      if (
        !this.correctFrameForInput ||
        !this.store.getters.keyAlreadyActive(key)
      )
        return;
      const item = this.store.getters.gridLayout.find(
        (item: any) => item.key.toUpperCase() === key
      );
      if (item) {
        //deactivateChannels(item.channels, item.intensity);
        this.store.dispatch(ActionTypes.removeActiveKey, key);
      }
    },
  },
});
</script>