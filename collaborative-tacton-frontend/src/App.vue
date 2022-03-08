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
import { mapGetters, mapActions } from "vuex";
import { RouteNames } from "./renderer/router/routes";

export default defineComponent({
  name: "App",
  computed: {
    ...mapGetters("viewPort", ["playGroundVisible", "editModeActive"]),
    ...mapGetters("directInput", ["keyAlreadyActive", "gridLayout"]),
  },
  watch: {
    $route(to) {
      //this.show = false;
      this.changePlayGroundVisible(to.name == RouteNames.PLAY_GROUND);
      console.log(to.name == RouteNames.PLAY_GROUND);
    },
  },
  methods: {
    ...mapActions("directInput", ["addActiveKey", "removeActiveKey"]),
    ...mapActions("viewPort", ["changePlayGroundVisible"]),
    correctFrameForInput(): boolean {
      return this.playGroundVisible || !this.editModeActive;
    },
    buttonDown(e: any) {
      const key: string = e.key.toUpperCase();
      if (!this.correctFrameForInput || this.keyAlreadyActive(key)) return;
      const item = this.gridLayout.find(
        (item: any) => item.key.toUpperCase() === key
      );
      if (item) {
        // activateChannels(item.channels, item.intensity);
        this.addActiveKey(key);
        console.log("down" + key)
      }
    },
    buttonUp(e: any) {
      const key = e.key.toUpperCase();
      if (!this.correctFrameForInput || !this.keyAlreadyActive(key)) return;
      const item = this.gridLayout.find(
        (item: any) => item.key.toUpperCase() === key
      );
      if (item) {
        //deactivateChannels(item.channels, item.intensity);
        this.removeActiveKey(key);
         console.log("up" + key)
      }
    },
  },
});
</script>