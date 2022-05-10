<template>
  <grid-layout
    :layout="store.state.playGround.gridLayout"
    :col-num="10"
    :row-height="100"
    :is-draggable="true"
    :is-resizable="false"
    :vertical-compact="false"
    :prevent-collision="true"
  >
    <grid-item
      v-for="item in store.state.playGround.gridLayout"
      :key="item.i"
      :static="false"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      @moved="movedEvent"
    >
      <KeyBoardButton
        :button="item"
        :isMoved="isMoved"
        @updateIsMoved="updateIsMoved"
      />
    </grid-item>
  </grid-layout>
</template>

<style lang="scss" scoped>
.playGroundView {
  display: flex;
  height: 100%;
  min-width: 100% !important;
  max-width: 100% !important;
  background-color: aquamarine;
}
</style>

<script>
import { useStore } from "@/renderer/store/store";
import { defineComponent } from "@vue/runtime-core";
import { GridLayout, GridItem } from "vue-grid-layout";
import KeyBoardButton from "./KeyBoardButton.vue";

export default defineComponent({
  name: "TactonScreen",
  components: {
    GridLayout,
    GridItem,
    KeyBoardButton,
  },
  data: () => ({
    store: useStore(),
    isMoved: false,
  }),
  methods: {
    movedEvent: function (i, newX, newY) {
      console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
      this.isMoved = true;
    },
    updateIsMoved: function (newValue) {
      this.isMoved = newValue;
    },
  },
});
</script>