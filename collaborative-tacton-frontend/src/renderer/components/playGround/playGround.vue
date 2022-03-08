<template>
  <div class="play-ground">
    <grid-layout
      :layout="gridLayout"
      :col-num="gridColNum"
      :row-height="50"
      :is-draggable="editModeActive"
      :is-resizable="false"
      :vertical-compact="false"
      :prevent-collision="true"
    >
      <grid-item
        v-for="item in gridLayout"
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
import { GridLayout } from "vue-grid-layout";
import { GridItem } from "vue-grid-layout";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PlayGround",
  components: {
    GridLayout,
    GridItem,
  },
  data() {
    return {
      draggable: true,
      static_: false,
    };
  },
  computed: {
    ...mapGetters("directInput", [
      "editModeActive",
      "gridColNum",
      "gridLayout",
    ]),
  },
  methods: {
    ...mapActions("directInput", ["updateButtonPosition"]),
    movedEvent: function (i, newX, newY) {
      //console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
      this.updateButtonPosition(i, newX, newY);
      return 0;
    },
  },
};
</script>
