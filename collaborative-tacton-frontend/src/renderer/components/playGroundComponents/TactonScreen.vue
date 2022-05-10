<template>
  <v-container class="playGroundView">
    <v-row no-gutters>Hello</v-row>
    <v-row no-gutters>mayname</v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.playGroundView {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 100% !important;
  max-width: 100% !important;
  background-color: aquamarine;
}
</style>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "TactonScreen",
});
</script>