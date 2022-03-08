<template>
  <div class="direct-input-keyboard-button">
    <BaseButton
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
      <div
        class="container"
        :style="{
          backgroundColor: selected ? color : '#c4c4cc',
        }"
      >
        <div class="key">{{ button.key + 1 }}</div>
      </div>
    </BaseButton>
  </div>
</template>

<script>
import { lightenDarkenColor } from "@/renderer/lib/colors.js";
//import { activateChannels, deactivateChannels } from "@/lib/direct-input.js";

export default {
  name: "KeyboardButtonConfig",
  props: {
    color: {
      type: String,
      default: "cornflowerblue",
    },
    button: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["select"],
  data: function () {
    return {
      buttonPressed: false,
    };
  },
  methods: {
    editButton() {
      console.log("edit");
    },
    lightenDarkenColor(color, amount) {
      return lightenDarkenColor(color, amount);
    },
    mouseDown() {
    //  activateChannels([this.button.key], 1);
      this.$emit("select", this.button.key);
    },
    mouseUp() {
     // deactivateChannels([this.button.key], 1);
    },
  },
};
</script>

<style scoped lang="scss">
.button {
  background: none;
  box-shadow: none;
  height: 100%;
  padding: 0;
  width: 100%;

  &:hover {
    background: none;
    box-shadow: none;
  }
}
.container {
  color: $font-color;
  font-weight: bold;
  width: 75px;
  height: 75px;
  font-size: 60px;
  vertical-align: middle;
  text-align: center;

  &:hover {
    color: black;
  }
}
</style>
