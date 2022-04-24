<template>
  <div class="play-ground">
    <grid-layout
      :layout="store.getters.gridLayout"
      :col-num="store.getters.gridColNum"
      :row-height="50"
      :is-draggable="true"
      :is-resizable="false"
      :vertical-compact="false"
      :prevent-collision="true"
    >
      <grid-item
        v-for="item in store.getters.gridLayout"
        :key="item.i"
        :static="false"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @moved="movedEvent"
      >
        <slot name="button-content" :item="item" />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import { useStore } from '@/renderer/store/store';
import { GridLayout } from "vue-grid-layout";
import { GridItem } from "vue-grid-layout";
import { ActionTypes } from "../../store/modules/directInput/actionTypes";

export default {
  name: "PlayGround",
  components: {
    GridLayout,
    GridItem,
  },
  data() {
    return {
      store:useStore(),
      draggable: true,
      static_: false,
    };
  },
  methods: {
    movedEvent: function (i, newX, newY) {
      //console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
      this.store.dispatch(ActionTypes.updateButtonPosition, {
        i,
        newX,
        newY,
      });
      return 0;
    },
  },
};
</script>
