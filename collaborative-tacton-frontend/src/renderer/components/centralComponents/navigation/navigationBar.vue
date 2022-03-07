<template>
  <nav>
    <router-link to="/">Devices</router-link> |
    <router-link to="/direct-input">Play Ground</router-link>
  </nav>
</template>

<script>
export default {
  name: "NavigationBar",
};
</script>

<style scoped lang="scss">
.nav {
  @include flexbox;
  @include flex-direction();
  @include size(100%, $nav-height);
  @include no-select;
  background-color: $darker-base-color;
  padding: 0 16px 0 16px;
  color: $font-color;
}

.status {
  margin-left: auto;
  padding: 10px 20px;
  min-width: 200px;
  margin-right: 10px;
}
.bluetooth-status {
  margin-left: auto;
  padding: 10px 20px;
  background-color: #fd5f00;
  min-width: 200px;
  margin-right: 10px;
  &.enabled {
    background-color: #42b983;
  }
}
</style>
