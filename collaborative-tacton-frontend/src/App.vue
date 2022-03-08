<template>
  <div
    tabindex="0"
    class="main"
    @keyup="buttonUp"
    @keydown="buttonDown"
  >
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
 .main{
     height: 100%;
     outline:none
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

export default defineComponent({
  name: "App",
  methods: {
    buttonDown(e: any) {
      const key = e.key.toUpperCase();
      console.log(key);
    },
    buttonUp(e: any) {
      console.log("up");
    },
  },
});
</script>