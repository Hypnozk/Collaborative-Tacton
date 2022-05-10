<template>
  <v-container class="playGroundView">
    <v-row no-gutters>
      <v-col cols="4">
        <TactonScreen />
      </v-col>
      <v-col cols="8">
        <GridSystem />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.playGroundView {
  display: flex;
  height: 100%;
  min-width: 100% ;
  max-width: 100%;
  padding: 1px;
}
</style>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import GridSystem from "./GridSystem.vue";
import TactonScreen from "./TactonScreen.vue";

export default defineComponent({
  name: "PlayGroundBody",
  components: {
    GridSystem,
    TactonScreen,
  },
});
</script>