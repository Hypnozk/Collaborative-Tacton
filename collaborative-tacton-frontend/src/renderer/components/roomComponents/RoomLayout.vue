<template>
<v-container fill-height class="roomLayout">
        <v-container fill-height>
          <v-row align="center" justify="center">
            <v-col cols="6" style="paddingtop: 25px; paddingleft: 60px"
              >Room</v-col
            >
            <v-col cols="6">
              <v-text-field
                hide-details="auto"
                v-model="roomName"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col
              cols="6"
              style="paddingtop: 25px; paddingleft: 60px"
              v-model="userName"
              >Username</v-col
            >
            <v-col cols="6">
              <v-text-field hide-details="auto"></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" style="margin-top: 40px">
            <v-btn elevation="2" color="primary" @click="enterRoom"
              >Enter Room</v-btn
            >
          </v-row>
          <v-row align="center" justify="center" style="margin-top: 40px">
            <v-btn elevation="2" color="primary" @click="enter">Enter</v-btn>
          </v-row>
        </v-container>
      </v-container>
</template>

<style lang="scss" scoped>
.roomLayout {
  display: flex;
  width: 70%;
  height: 100%;
  align-items: center;
  font-weight: bold;
  font-size: 1.5em;
}
</style>

<script lang="ts">
import { WS_MSG_TYPE } from "../../WebSocketManager/ws_types";
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "../../store/store";
import { sendMessage } from "../../WebSocketManager";
import { MutationTypes } from "../../store/modules/roomSettings/roomSettings";

export default defineComponent({
  name: "RoomLayout",
  data() {
    return {
      userName: "",
      store: useStore(),
    };
  },
  computed: {
    roomName: {
      get(): string {
        return this.store.state.roomSettings.name;
      },
      set(value: string) {
        this.store.commit(MutationTypes.UPDATE_ROOM_NAME, value);
      },
    },
  },
  methods: {
    enterRoom() {
      console.log("send");
      sendMessage(WS_MSG_TYPE.GET_ROOM_INFO, this.roomName);
    },
    enter() {
      //this.clientWS.send("hello")
      console.log(this.roomName);
    },
  },

  /**

 */
});
</script>