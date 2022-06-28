<template>
  <grid-layout
    :layout="store.state.playGround.gridItems"
    :col-num="store.state.playGround.gridLayout.x"
    :row-height="rowHeight"
    :maxRows="store.state.playGround.gridLayout.y"
    :is-draggable="store.state.playGround.inEditMode"
    :is-resizable="false"
    :vertical-compact="false"
    :prevent-collision="true"
  >
    <grid-item
      v-for="item in store.state.playGround.gridItems"
      :key="item.i"
      :static="false"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      @moved="movedEvent"
      @move="moveEvent"
    >
      <KeyBoardButton
        :button="item"
        :isMoved="isMoved"
        @updateisMoved="updateisMoved"
        @editButton="(id) => $emit('editButton', id)"
      />
    </grid-item>
  </grid-layout>
</template>

<script>
import {
  PlayGroundActionTypes,
  PlayGroundMutations,
} from "@/renderer/store/modules/playGround/types";
import { useStore } from "@/renderer/store/store";
import { defineComponent } from "@vue/runtime-core";
import { GridLayout, GridItem } from "vue-grid-layout";
import KeyBoardButton from "./KeyBoardButton.vue";

export default defineComponent({
  name: "GridArea",
  components: {
    GridLayout,
    GridItem,
    KeyBoardButton,
  },
  emits: ["editButton"],
  data: () => ({
    store: useStore(),
    rowHeight: 100,
    isMoved: false,
  }),
  mounted() {
    window.addEventListener("resize", this.resizeScreen);
    this.resizeScreen();
  },
  methods: {
    movedEvent: function (i, newX, newY) {
      //console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
      this.store.dispatch(PlayGroundActionTypes.updateKeyButton, {
        id: i,
        props: {
          x: newX,
          y: newY,
        },
      });
    },
    moveEvent: function (i, newX, newY) {
      //console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
      this.isMoved = true;
    },
    updateisMoved: function (newValue) {
      this.isMoved = newValue;
    },
    resizeScreen() {
      const height =
        window.innerHeight -
        document.getElementById("gridHeader").clientHeight -
        document.getElementById("headerPlayGround").clientHeight -
        20;

      if (height == undefined || height == null) return;
      this.rowHeight = Math.floor(
        height / this.store.state.playGround.gridLayout.y
      );
    },
  },
});
</script>
