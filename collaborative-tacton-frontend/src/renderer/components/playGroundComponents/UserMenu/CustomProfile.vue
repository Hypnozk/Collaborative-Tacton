<template>
  <svg
    width="40"
    height="37"
    @click="$emit('displayMenuDialog')"
    :class="[isFirstEntry ? '' : 'secondEntries']"
    :cursor="clickable == true? 'pointer':''"
  >
    <circle
      cx="20"
      cy="19"
      r="16"
      :fill="color"
      stroke="black"
      stroke-width="1"
    />
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      stroke="white"
      stroke-width="2px"
      dy=".4em"
    >
     {{letter}}
    </text>
  </svg>
</template>

<style lang="scss" scoped>
.secondEntries {
  margin-left: -15px;
}
</style>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "CustomProfile",
  emits: ["displayMenuDialog"],
  props: {
    letter: {
      type: String,
    },
    color: {
      type: String,
    },
    isFirstEntry:{
      type:Boolean
    },
    clickable:{
      type:Boolean
    }
  },
});
</script>
