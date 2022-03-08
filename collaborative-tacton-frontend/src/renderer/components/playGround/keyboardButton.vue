<template>
  <div class="direct-input-keyboard-button">
    <BaseButton
      v-if="!editModeActive"
      class="button"
      @mousedown="
        mouseDown();
        buttonPressed = true;
      "
      @mouseup="
        mouseUp();
        buttonPressed = false;
      "
      @mouseleave="
        if (buttonPressed) {
          mouseUp();
          buttonPressed = false;
        }
      "
    >
      <div class="content" :style="{ background: color }">
        <div class="name">{{ button.name }}</div>
        <div class="intensity">{{ button.intensity * 100 }}%</div>
        <div class="key">{{ button.key }}</div>
        <div class="channels">{{ button.channels.map((val) => val + 1) }}</div>
      </div>
    </BaseButton>
    <div v-else class="content" :style="{ background: color }">
      <div class="name">{{ button.name }}</div>
      <div class="intensity">{{ button.intensity * 100 }}%</div>
      <div class="key">{{ button.key }}</div>
      <div class="channels">{{ button.channels.map((val) => val + 1) }}</div>
      <BaseButton class="edit" @click="$emit('edit', button.i)">
        <svg class="icon" :width="20" :height="20" viewBox="0 0 24 24">
          <path :d="mdiPencil"></path>
        </svg>
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { lightenDarkenColor } from "@/renderer/lib/colors";
import { mapGetters } from "vuex";
import { mdiPencil } from "@mdi/js";
//import { activateChannels, deactivateChannels } from "@/lib/direct-input.js";

export default {
  name: "KeyboardButton",
  props: {
    button: {
      type: Object,
      required: true,
    },
  },
  emits: ["edit"],
  setup() {
    return { mdiPencil };
  },
  data: function () {
    return {
      buttonPressed: false,
    };
  },
  computed: {
    color() {
      return this.channelsActive(this.button.channels)
        ? lightenDarkenColor(this.button.color, -50)
        : this.button.color;
    },
    ...mapGetters("directInput", [
      "channelsActive",
      "editModeActive",
      "globalIntensity",
    ]),
  },

  methods: {
    mouseDown() {
    //  activateChannels(this.button.channels, this.button.intensity);
    },
    mouseUp() {
     // deactivateChannels(this.button.channels, this.button.intensity);
    },
  },
};
</script>

<style scoped lang="scss">
div {
  vertical-align: middle;
}
.button {
  background: 0;
  height: 100%;
  padding: 0;
  width: 100%;
}
.content {
  color: $font-color;
  display: grid;
  font-weight: bold;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 0.5fr 0.8fr 0.4fr 0.1fr;
  gap: 0.7em 0.7em 0;
  grid-template-areas:
    "name intensity intensity"
    "key key key"
    "channels channels edit";
  height: 100%;
  padding: 10px;
  width: 100%;

  &:hover {
    color: black;
  }
}
.name {
  grid-area: name;
  text-align: left;
}
.intensity {
  grid-area: intensity;
  text-align: right;
}
.key {
  font-size: 60px;
  grid-area: key;
  text-align: center;
}
.channels {
  grid-area: channels;
  text-align: center;
}
.edit {
  grid-area: edit;
  padding: 0 5px;
}
.icon {
  fill: $font-color;

  &:hover {
    fill: black;
  }
}
</style>
