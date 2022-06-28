<template>
  <v-card
    class="mx-auto pa-1 keyButton"
    max-width="100"
    min-width="100"
    min-height="100"
    @click="handleMouse(false)"
    @mouseleave="handleMouseLeave()"
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
        <v-icon class="mr-1" small v-if="store.state.playGround.inEditMode">
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
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
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
      buttonPressed: false,
    };
  },
  props: {
    button: {
      type: Object as () => KeyBoardButton,
      required: true,
    },
    isMoved: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["updateisMoved","editButton"],
  computed: {
    colorActuator() {
      if (this.button.isActive.mouse || this.button.isActive.keyboard)
        return lightenDarkenColor(this.button.color, -100);
      return this.button.color;
    },
  },
  methods: {
    handleMouseLeave() {
      if (!this.store.state.playGround.inEditMode) {
        this.store.dispatch(PlayGroundActionTypes.deactivateKey, {
          buttonKey: this.button.key,
          mouse: false,
        });
      }
    },
    handleMouse(mouseDown: boolean) {
      if (this.isMoved) {
        //moving card is finished, reset variable
        this.$emit("updateisMoved", false);
        return;
      }

      if (this.store.state.playGround.inEditMode) {
        if (!mouseDown) {
          //the button wanted to be edit
          this.$emit("editButton", this.button.i);
        }
      } else {
        if (mouseDown) {
          //button clicked
          this.buttonPressed = true;
          this.store.dispatch(PlayGroundActionTypes.activateKey, {
            buttonKey: this.button.key,
            mouse: true,
          });
        } else {
          if (this.buttonPressed) {
            this.buttonPressed = false;
            this.store.dispatch(PlayGroundActionTypes.deactivateKey, {
              buttonKey: this.button.key,
              mouse: false,
            });
          }
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
