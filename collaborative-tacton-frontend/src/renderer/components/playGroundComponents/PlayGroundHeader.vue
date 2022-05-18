<template>
  <v-container class="headerPlayGround">
    <v-row class="align-center">
      <v-col style="padding: 0px 0px 0px 10px">
        {{
          `${store.state.roomSettings.roomName}#${store.state.roomSettings.id}`
        }}
        <v-btn variant="text" icon="mdi-content-copy" @click="copyAdress">
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>

      <v-menu
        class="customMenu"
        stlye="margin-right:5px"
        v-model="participantMenu"
      >
        <template v-slot:activator="{ props }">
          <v-btn variant="text" v-bind="props">
            {{
              `Participants: ${store.state.roomSettings.participants.length}`
            }}
          </v-btn>
        </template>
        <v-list>
          <div style="border: 1px solid #ddd" class="customField">
            <div class="inline">
              <input
                style="padding: 5px"
                class="inputField"
                v-model="userName"
              />
              <v-icon right @click="participantMenu = false">
                mdi-content-save
              </v-icon>
            </div>
          </div>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :value="index"
            class="customMenu"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn variant="text" style="margin-right: 20px">
        Log out <v-icon right> mdi-logout </v-icon></v-btn
      >
    </v-row>
  </v-container>
</template>

<style lang="scss">
.headerPlayGround {
  min-width: 100% !important;
  max-width: 100% !important;
  border-bottom: 1px solid rgb(48, 41, 41);
}
.playGroundView {
  display: flex;
  height: 100%;
  min-width: 100% !important;
  max-width: 100% !important;
}

.customField {
  display: flex;
  align-items: center;
  margin: 0 10px;
  .inline {
    width: 100%;
    display: flex;
    align-items: center;
    padding-right: 5px;
  }
}

.customField:focus-within {
  border: solid !important;
  border-color: black !important;
  border-width: thin !important;
}

.inputField {
  outline: none;
  flex-grow: 1;
}

.customMenu {
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 280px;
}
</style>
<script lang="ts">
import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";
import { GeneralSettingsActionTypes } from "@/renderer/store/modules/generalSettings/generalSettings";
import { RoomMutations } from "@/renderer/store/modules/roomSettings/roomSettings";
import { useStore } from "@/renderer/store/store";
import { defineComponent } from "@vue/runtime-core";
import { sendSocketMessage } from "../../CommunicationManager/WebSocketManager";
import { WS_MSG_TYPE } from "../../CommunicationManager/WebSocketManager/ws_types";

export default defineComponent({
  name: "PlayGroundHeader",
  data: () => ({
    store: useStore(),
    participantMenu: false,
    items: [
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me 2" },
    ],
  }),
  computed: {
    userName: {
      get(): string {
        return this.store.state.roomSettings.user.userName;
      },
      set(value: string) {
        this.store.commit(RoomMutations.UPDATE_USER_NAME, value);
      },
    },
  },
  watch: {
    participantMenu(newValue) {
      if (newValue == false && this.store.getters.userNameUpdated){
        this.store.dispatch(GeneralSettingsActionTypes.userNameGetSaved);
        /**sendSocketMessage(WS_MSG_TYPE.UPDATE_USER_ACCOUNT_SERV, {
          roomId: this.store.state.roomSettings.id,
          user: this.store.state.roomSettings.user,
        });
        */
        }
    },
  },
  methods: {
    logOut() {
      this.store.state.roomSettings.roomName;
    },
    copyAdress() {
      window.api.send(
        IPC_CHANNELS.main.copyToClipBoard,
        `${this.store.state.roomSettings.roomName}#${this.store.state.roomSettings.id}`
      );
    },
  },
});
</script>