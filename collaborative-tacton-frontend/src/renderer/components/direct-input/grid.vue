<template>
  <div class="direct-input-grid">
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
      >
        <slot name="button-content" :item="item" />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import { mapGetters } from "vuex";

export default {
  name: "DirectInputGrid",
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
};
</script>
