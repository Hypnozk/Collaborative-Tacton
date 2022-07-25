<template>
  <div id="headerPlayGround" class="headerPlayGround" no-gutters>
    <v-row class="align-center" no-gutters>
      <v-col style="padding: 0px 0px 0px 10px; flex-grow: 1">
        {{
          `${store.state.roomSettings.roomName}#${store.state.roomSettings.id}`
        }}
        <v-btn variant="text" icon="mdi-content-copy" @click="copyAdress">
        </v-btn>
      </v-col>
      <UserMenu />

      <v-btn variant="text" style="margin-right: 20px" @click="settings">
        Settings <v-icon right> mdi-cog-outline </v-icon>
      </v-btn>
      <v-btn variant="text" style="margin-right: 20px" @click="logOut">
        Log out <v-icon right> mdi-logout </v-icon>
      </v-btn>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.headerPlayGround {
  min-width: 100% !important;
  max-width: 100% !important;
  border-bottom: 1px solid rgb(48, 41, 41);
  min-height: 50px;
  padding: 2px 10px;
  display: flex;
}
</style>
<script lang="ts">
import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";
import router from "@/renderer/router";
import { GeneralSettingsActionTypes } from "@/renderer/store/modules/generalSettings/generalSettings";
import { useStore } from "@/renderer/store/store";
import { defineComponent } from "@vue/runtime-core";
import { sendSocketMessage } from "../../CommunicationManager/WebSocketManager";
import { WS_MSG_TYPE } from "../../CommunicationManager/WebSocketManager/ws_types";
import UserMenu from "./UserMenu/UserMenu.vue";

export default defineComponent({
  name: "PlayGroundHeader",
  components: {
    UserMenu,
  },
  data: () => ({
    store: useStore(),
  }),
  methods: {
    logOut() {
      sendSocketMessage(WS_MSG_TYPE.LOG_OUT, {
        roomId: this.store.state.roomSettings.id,
        user: this.store.state.roomSettings.user,
      });
      router.push("/");
    },
    copyAdress() {
      console.log(this.store.getters);
      this.store.dispatch(GeneralSettingsActionTypes.copyAdressToClipboard);
      window.api.send(
        IPC_CHANNELS.main.copyToClipBoard,
        `${this.store.state.roomSettings.roomName}#${this.store.state.roomSettings.id}`
      );
    },
    settings() {
      sendSocketMessage(
        WS_MSG_TYPE.ROOM_INFO_SERV,
        this.store.state.roomSettings.id
      );
    },
  },
});
</script>
