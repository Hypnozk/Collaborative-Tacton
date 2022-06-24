<template>
  <v-card
    class="mx-auto pa-1 keyButton"
    max-width="100"
    min-width="100"
    min-height="100"
    @click="handleMouse(false)"
    @mousedown="handleMouse(true)"
    v-bind:style="{ backgroundColor: colorActuator }"
  >
    <v-card-text style="padding: 1px" class="keyButton">
      <v-row no-gutters>
        {{ button.name }}
        <v-spacer />
        <div>{{ button.intensity * 100 }}%</div>
      </v-row>
      <v-row no-gutters class="cardMainRow">
        <div>{{ button.key }}</div>
      </v-row>
    </v-card-text>
    <v-card-actions style="padding: 2px; min-height: 0">
      <v-row align="center" no-gutters justify="center">
        {{ listChannels() }}
        <v-spacer />
        <v-icon class="mr-1" small v-if="this.store.state.playGround.inEditMode">
          mdi-pencil
        </v-icon>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
.keyButton {
  display: flex;
  flex-direction: column;
}

.cardMainRow {
  flex-grow: 1;
  margin: 0;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  font-weight: bold;
}
</style>

<script lang="ts">
import { useStore } from "@/renderer/store/store";
import { defineComponent } from "@vue/runtime-core";
import { KeyBoardButton } from "@/types/GeneralType";
import { lightenDarkenColor } from "../../lib/colors";
import { PlayGroundActionTypes } from "@/renderer/store/modules/playGround/types";

export default defineComponent({
  name: "KeyBoardButton",
  data() {
    return {
      store: useStore(),
    };
  },
  props: {
    button: {
      type: Object as () => KeyBoardButton,
      required: true,
    },
  },
  emits: ["editButton"],
  computed: {
    colorActuator() {
      if (this.button.isActive) return lightenDarkenColor(this.button.color, -100);
      return this.button.color;
    },
  },
  methods: {
    handleMouse(mouseDown: true) {
      if (this.store.state.playGround.inEditMode) {
        if (!mouseDown) {
          //the button wanted to be edit
          this.$emit("editButton", this.button.i);
        }
      } else {
        if (mouseDown) {
          //button clicked
          this.store.dispatch(PlayGroundActionTypes.activateKey, this.button.key);
        } else {
          this.store.dispatch(PlayGroundActionTypes.deactivateKey, this.button.key);
        }
      }
    },
    listChannels(): string {
      let channelList = "[";
      this.button.channels.forEach((channel: number, index: number) => {
        channelList += channel + 1;
        if (index !== this.button.channels.length - 1) channelList += ", ";
      });
      channelList += "]";
      return channelList;
    },
  },
});
</script>
