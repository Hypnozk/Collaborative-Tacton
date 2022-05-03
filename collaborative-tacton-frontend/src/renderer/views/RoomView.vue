<template>
  <v-dialog v-model="showRoomDialog" max-width="290">
    <template v-slot:activator>
      <v-container fill-height class="container">
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
    <v-card>
      <v-card-title class="text-h5">
        Use Google's location service?
      </v-card-title>
      <v-card-text
        >Let Google help apps determine location. This means sending anonymous
        location data to Google, even when no apps are running.</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="cancelDialog">
          Disagree
        </v-btn>
        <v-btn color="green darken-1" text @click="cancelDialog"> Agree </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 70%;
  height: 100%;
  align-items: center;
  font-weight: bold;
  font-size: 1.5em;
}
</style>

<script lang="ts">
import { WS_MSG_TYPE } from "../WebSocketManager/ws_types";
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "../store/store";
import { sendMessage } from "../WebSocketManager";
import { MutationTypes } from "../store/modules/roomSettings/roomSettings";
import { GeneralSettingsActionTypes } from "../store/modules/generalSettings/generalSettings";
import { RouterNames } from "@/types/Routernames";
export default defineComponent({
  name: "RoomView",
  data() {
    return {
      userName: "",
      store: useStore(),
    };
  },
  computed: {
    showRoomDialog: {
      get(): boolean {
        return this.store.getters.showRoomDialog;
      },
      set() { this.store.dispatch(
        GeneralSettingsActionTypes.changeCurrentView,
        RouterNames.ROOM
      )},
    },
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
    cancelDialog() {
      this.store.dispatch(
        GeneralSettingsActionTypes.changeCurrentView,
        RouterNames.ROOM
      );
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