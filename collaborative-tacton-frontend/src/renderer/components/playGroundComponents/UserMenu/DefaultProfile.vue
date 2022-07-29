<template>
  <svg
    width="30"
    viewBox="0 0 512 512"
    @click="$emit('displayMenuDialog')"
    :class="['svgImage', isFirstEntry ? '' : 'secondEntries']"
    :cursor="clickable == true ? 'pointer' : ''"
  >
    <path :fill="color" d="m0,256a256,256 0 1 1 512,0a256,256 0 1 1 -512,0" />
    <path
      stroke="#000"
      id="svg_2"
      fill="white"
      d="m202.39474,107.32625c14.53319,-17.62688 34.98517,-27.32625 57.6051,-27.32625s42.88838,9.765 57.47892,27.48375c14.78554,17.955 21.97757,42.07875 20.27993,68.01375c-3.39528,51.5025 -38.26575,93.5025 -77.75885,93.5025s-74.43239,-42 -77.75885,-93.51563c-1.68617,-26.145 5.49439,-50.3475 20.15375,-68.15813z"
    />
    <path
      stroke="#000"
      id="svg_3"
      fill="white"
      d="m257.99999,450.99997a225.62999,255.40057 0 0 1 -161.99999,-77.45409a158.02714,178.87791 0 0 1 45.18,-48.66713c32.77286,-23.78053 74.25,-36.87874 116.82,-36.87874s84.04714,13.09821 116.78142,36.87874a157.97571,178.81969 0 0 1 45.21857,48.66713a225.57856,255.34236 0 0 1 -161.99999,77.45409z"
    />
  </svg>
</template>

<style lang="scss" scoped>
.svgImage {
  display:flex;
  align-items:center;
  height:100%;
}
.secondEntries {
  margin-left: -10px;
}
</style>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "DefaultProfile",
  emits: ["displayMenuDialog"],
  props: {
    color: {
      type: String,
    },
    isFirstEntry: {
      type: Boolean,
    },
    clickable: {
      type: Boolean,
    },
  },
});
</script>
