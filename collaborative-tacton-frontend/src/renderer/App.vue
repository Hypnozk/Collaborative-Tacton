<template>
  <NavigationBar />
  <router-view :key="$route.fullPath" />
</template>

<script>
import NavigationBar from "./components/centralComponents/navigation/navigationBar.vue";
export default {
  name: "App",
  components: {
    NavigationBar,
  },
};
</script>

<style lang="scss">
html,
body {
  height: auto;
  min-height: 100%;
  background-color: $darker-base-color;
  color: $font-color;
  ::selection {
    background-color: $accent;
    color: $font-color-darker;
  }
}
</style>
