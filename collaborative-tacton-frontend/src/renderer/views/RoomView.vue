<template>
  <v-container fill-height class="roomView">
    <v-container fill-height>
      <v-row justify="center">
        <v-col cols="2" align-self="center" style="margin-top: 10px"> Room </v-col>
        <v-col cols="6">
          <v-text-field
            variant="underlined"
            hide-details="auto"
            v-model="roomName"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" style="margin-top: 40px">
        <v-btn elevation="2" color="primary" @click="enterRoom">Enter Room</v-btn>
      </v-row>
    </v-container>
  </v-container>
</template>

<style lang="scss" scoped>
.roomView {
  align-items: center;
  display: flex;
  height: 100%;
}
</style>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "../store/store";
import { RoomMutations } from "../store/modules/roomSettings/roomSettings";
import { sendSocketMessage } from "../CommunicationManager/WebSocketManager";
import { WS_MSG_TYPE } from "../CommunicationManager/WebSocketManager/ws_types";

export default defineComponent({
  name: "RoomView",
  data() {
    return {
      userName: "",
      store: useStore(),
    };
  },
  computed: {
    roomName: {
      get(): string {
        return this.store.state.roomSettings.roomName;
      },
      set(value: string) {
        this.store.commit(RoomMutations.UPDATE_ROOM_NAME, value);
      },
    },
  },
  methods: {
    enterRoom() {
      sendSocketMessage(WS_MSG_TYPE.ROOM_INFO_SERV, this.roomName);
    },
  },
});
</script>
