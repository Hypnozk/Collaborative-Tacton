<template>
  <div class="direct-input-keyboard-button">
    <BaseButton class="button" @click=" $emit('select', this.buttonKey)">
      <div
        class="container"
        :style="{
          backgroundColor: isSelected ? color : '#c4c4cc',
        }"
      >
        <div class="key">{{ buttonKey + 1 }}</div>
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
    buttonKey: {
      type: Number,
      required: true,
    },
    isSelected:{
      type:Boolean,
      required:true
    }
  },
  emits: ["select"],
  data: function () {
    return {
      buttonPressed: false,
    };
  },
  methods: {
    lightenDarkenColor(color, amount) {
      return lightenDarkenColor(color, amount);
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
