<template>
  <v-card
    class="mx-auto pa-1 keyButton"
    max-width="100"
    min-width="100"
    min-height="100"
    @click="mouseUp()"
    @mousedown="mouseDown()"
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
        <v-icon class="mr-1" small @click.stop @mouseup.stop @click="edit">
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
import { sendSocketMessage } from "../../CommunicationManager/WebSocketManager";
import { WS_MSG_TYPE } from "../../CommunicationManager/WebSocketManager/ws_types";
import { PlayGroundActionTypes } from "@/renderer/store/modules/playGround/playGround";

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
    isMoved: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["updateisMoved", "editButton"],
  computed: {
    colorActuator() {
      console.log("colorActuator: " + this.button.isActive);
      if (this.button.isActive)
        return lightenDarkenColor(this.button.color, -100);
      return this.button.color;
    },
  },
  methods: {
    handleMouse(mouseDown: true) {
      //console.log("isMoved: " + this.isMoved);
      //console.log("mousedown " + mouseDown);
      if (!mouseDown && this.isMoved) {
        //moving card is finished, just reset variable
        this.$emit("updateisMoved", false);
        return;
      }
      if (mouseDown) {
        //button clicked
        this.store.dispatch(PlayGroundActionTypes.activateKey, this.button.key);
      } else {
        this.store.dispatch(PlayGroundActionTypes.deactivateKey, this.button.key);
      }
    },
    mouseUp() {
      const refhandleMouse = this.handleMouse;
      setTimeout(refhandleMouse, 150, false);
    },
    mouseDown() {
      console.log("colorActuator: " + this.button.isActive);
      const refHandleMouse = this.handleMouse;
      setTimeout(refHandleMouse, 150, true);
    },
    edit() {
      //the button wanted to be edit
      this.$emit("updateisMoved", false);
      this.$emit("editButton", this.button.i);
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