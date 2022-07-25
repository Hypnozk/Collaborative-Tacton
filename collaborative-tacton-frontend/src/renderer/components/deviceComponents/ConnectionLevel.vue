<template>
  <svg viewBox="0 0 270 105">
    <g @mouseover="hoverStart" @mouseleave="hoverEnd">
      <rect x="-10" y="-10" width="70" height="70" opacity="0" />
      <rect
        x="10"
        y="30"
        width="10"
        height="20"
        rx="4"
        ry="4"
        fill="#616161"
        stroke="black"
        stroke-width="0.5"
      />
      <rect
        x="25"
        y="15"
        width="10"
        height="35"
        rx="4"
        ry="4"
        :fill="connectionQuality >= -70 ? '#616161' : 'white'"
        stroke="black"
        stroke-width="0.5"
      />
      <rect
        x="40"
        y="5"
        width="10"
        height="45"
        rx="4"
        ry="4"
        :fill="connectionQuality >= -60 ? '#616161' : 'white'"
        stroke="black"
        stroke-width="0.5"
      />
    </g>
    <g :id="customId" class="shadow">
      <polygon
        :points="customField"
        fill="#616161"
        stroke="black"
        stroke-width="0.5"
      />
      <text
        x="10"
        y="65"
        dy="1em"
        text-anchor="right"
        fill="white"
        font-size="1.5em"
      >
        Connection: {{ qualityLevel }}
      </text>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.shadow {
  opacity: 0;
  pointer-events: none;
  -webkit-filter: drop-shadow(4px 4px 3px rgba(0, 0, 0, 0.7));
  filter: drop-shadow(4px 4px 3px rgba(0, 0, 0, 0.7));
}
.showElements {
  opacity: 1;
}
</style>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  name: "ConnectionLevel",
  props: {
    connectionQuality: {
      type: Number,
    },
  },
  data() {
    return {
      customId: uuidv4().toString(),
    };
  },
  computed: {
      customField() {
        const normalPath = "0,65 10,50 20,65 220,65 220,100 0,100"
      if (this.connectionQuality == undefined) return normalPath;
      if (this.connectionQuality >= -60) return normalPath;
      if (this.connectionQuality >= -70) return  "0,65 10,50 20,65 250,65 250,100 0,100";

      return normalPath;
    },
    qualityLevel() {
      if (this.connectionQuality == undefined) return "Bad";
      if (this.connectionQuality >= -60) return "Good";
      if (this.connectionQuality >= -70) return "Average";

      return "Bad";
    },
  },
  methods: {
    hoverStart() {
      const object = document.getElementById(this.customId);
      if (object == null) return;
      object.classList.add("showElements");
    },
    hoverEnd() {
      const object = document.getElementById(this.customId);
      if (object == null) return;
      object.classList.remove("showElements");
    },
  },
});
</script>
