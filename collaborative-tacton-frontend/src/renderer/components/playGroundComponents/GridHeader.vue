<template>
  <v-row no-gutters style="margin: 5px 10px 40px 10px">
    <v-btn elevation="2" color="primary" @click="openDialog"> Add Button </v-btn>
    <v-switch
      v-model="editModeOne"
      :label="`Edite Mode: ${editModeOne ? 'on' : 'off'}`"
      color="primary"
      :value="true"
      hide-details
      class="customSwitch black--text"
    ></v-switch>
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

<style lang="scss">
.slider {
  justify-content: center;
  align-items: center;
}
.customSwitch {
  padding: 0px 10px;
  display: flex;
  align-items: center;
  color: #000000 !important;
  opacity: 1;
  .v-selection-control {
    size: 10px;
    height: 15px;
  }
  .v-input--density-default {
    --v-input-control-height: 0px;
  }
}
</style>

<script>
import { PlayGroundMutations } from "@/renderer/store/modules/playGround/types";
import { useStore } from "@/renderer/store/store";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "GridHeader",
  emits: ["openDialog"],
  data: () => ({
    store: useStore(),
  }),
  computed: {
    intensity: {
      get() {
        return this.store.state.playGround.globalIntensity;
      },
      set(value) {
        this.store.commit(PlayGroundMutations.UPDATE_GLOBAL_INTENSITY, value);
      },
    },
    editModeOne: {
      get() {
        return this.store.state.playGround.inEditMode;
      },
      set(value) {
        this.store.commit(PlayGroundMutations.UPDATE_EDIT_MDOE, value);
      },
    },
  },
  methods: {
    openDialog() {
      this.$emit("openDialog");
    },
  },
});
</script>
