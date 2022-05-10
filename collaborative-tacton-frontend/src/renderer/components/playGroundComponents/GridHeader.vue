<template>
  <v-row no-gutters style="padding: 20px">
    <v-btn elevation="2" color="primary" v-bind="activator">
      Add Button
    </v-btn>
    <v-spacer />
    <v-col cols="4">
      <v-row no-gutters class="slider">
        Intensity:
        <v-slider
          v-model="intensity"
          step="0.1"
          max="1"
          min="0"
          hide-details
          style="padding: 0px 10px"
        />
        {{ `${intensity * 100} %` }}
      </v-row>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.slider {
  justify-content: center;
  align-items: center;
}
</style>

<script>
import { MutationTypes } from "@/renderer/store/modules/playGround/playGround";
import { useStore } from "@/renderer/store/store";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "GridHeader",
  data: () => ({
    store: useStore(),
  }),
  props: {
    activator: {
      type: Object,
      required: true,
    },
  },
  computed: {
    intensity: {
      get() {
        return this.store.state.playGround.globalIntensity;
      },
      set(value) {
        this.store.commit(MutationTypes.UPDATE_GLOBAL_INTENSITY, value);
      },
    },
  },
});
</script>