<template>
  <grid-layout
    :layout="store.state.playGround.gridItems"
    :col-num="store.state.playGround.gridLayout.x"
    :row-height="100"
    :maxRows="store.state.playGround.gridLayout.y"
    :is-draggable="true"
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
    >
      <KeyBoardButton
        :button="item"
        @editButton="(id) => $emit('editButton', id)"
      />
    </grid-item>
  </grid-layout>
</template>


<script>
import {
  PlayGroundActionTypes
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
  }),
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
  },
});
</script>