<template>
  <div style="padding-right: 20px" v-click-outside="leaveMenu">
    <div style="height: 40px; display: flex; align-item: center">
      <div
        v-for="(item, index) in store.state.roomSettings.participants"
        v-bind:key="index"
      >
        <CustomProfile
          v-if="item.name !== ''"
          :letter="item.name.charAt(0).toUpperCase()"
          :color="item.color"
          :isFirstEntry="index == 0"
          :clickable="true"
          @displayMenuDialog="switchMenu"
        />
        <DefaultProfile
          v-else
          :color="item.color"
          :isFirstEntry="index == 0"
          :clickable="true"
          @displayMenuDialog="switchMenu"
        />
      </div>
      <div
        style="
          display: flex;
          align-items: flex-end;
          font-size: 1.5em;
          padding-top: 10px;
          cursor: pointer;
        "
        v-if="store.state.roomSettings.participants.length > 5"
        @click="switchMenu"
      >
        ...
      </div>
    </div>
    <div class="dropdown-content" v-if="displayUserDialog">
      <v-list>
        <div style="display: flex; padding-left: 5px">
          <CustomProfile
            v-if="store.getters.userNameFromServer.name !== ''"
            :letter="store.getters.userNameFromServer.name.charAt(0).toUpperCase()"
            :color="store.getters.userNameFromServer.color"
            :isFirstEntry="true"
            :clickable="false"
          />
          <DefaultProfile
            v-else
            :color="store.getters.userNameFromServer.color"
            :isFirstEntry="true"
            :clickable="false"
          />

          <div style="border: 1px solid #ddd" class="customField">
            <div class="inline">
              <input class="inputField" v-on:keyup.enter="leaveMenu" v-model="userName" />
              <v-icon right @click="leaveMenu"> mdi-content-save </v-icon>
            </div>
          </div>
        </div>
        <v-list-item
          v-for="(item, index) in participantList"
          :key="index"
          :value="index"
          class="customMenu"
        >
          <div style="display: flex; padding-left: 3px">
            <DefaultProfile :color="item.color" :isFirstEntry="true" :clickable="false" />
            <div class="partName">
              {{ item.name == "" ? "Guest" : item.name }}
            </div>
          </div>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.customField {
  display: flex;
  align-items: center;
  margin: 0 10px;
  .inline {
    display: flex;
    align-items: center;
  }
}

.customField:focus-within {
  border: solid !important;
  border-color: black !important;
  border-width: thin !important;
}

.inputField {
  padding-left: 5px;
  outline: none;
  flex-grow: 1;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  background-color: #f1f1f1;
  min-width: 60px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  text-decoration: none;
  display: block;
}
.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}
.customMenu {
  pointer-events: none;
  padding: 0 0 0 3px !important;
}

.partName {
  margin: 0 10px;
  display: flex;
  align-items: center;
}
</style>
<script lang="ts">
import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";
import {
  GeneralMutations,
  GeneralSettingsActionTypes,
} from "@/renderer/store/modules/generalSettings/generalSettings";
import { RoomMutations } from "@/renderer/store/modules/roomSettings/roomSettings";
import { useStore } from "@/renderer/store/store";
import { RouterNames } from "@/types/Routernames";
import { defineComponent } from "@vue/runtime-core";
import { sendSocketMessage } from "../../../CommunicationManager/WebSocketManager";
import { WS_MSG_TYPE } from "../../../CommunicationManager/WebSocketManager/ws_types";
import CustomProfile from "./CustomProfile.vue";
import DefaultProfile from "./DefaultProfile.vue";

export default defineComponent({
  name: "UserMenu",
  components: {
    CustomProfile,
    DefaultProfile,
  },
  data: () => ({
    store: useStore(),
  }),
  computed: {
    userName: {
      get(): string {
        return this.store.state.roomSettings.user.name;
      },
      set(value: string) {
        this.store.commit(RoomMutations.UPDATE_USER_NAME, value);
      },
    },
    participantList() {
      return this.store.state.roomSettings.participants.filter(
        (user) => user.id !== this.store.state.roomSettings.user.id
      );
    },
    displayUserDialog() {
      return (
        this.store.state.generalSettings.currentView == RouterNames.PLAY_GROUND_USERS
      );
    },
  },
  watch: {
    displayUserDialog(newValue) {
      if (newValue == false && this.store.getters.userNameUpdated) {
        //save that its stored to show snackbar
        this.store.dispatch(GeneralSettingsActionTypes.userNameGetSaved);
        //save the setting inside of the config file
        window.api.send(
          IPC_CHANNELS.main.saveUserName,
          this.store.state.roomSettings.user.name
        );
        //update user that the userName get changed
        sendSocketMessage(WS_MSG_TYPE.UPDATE_USER_ACCOUNT_SERV, {
          roomId: this.store.state.roomSettings.id,
          user: this.store.state.roomSettings.user,
        });
      }
    },
  },
  methods: {
    leaveMenu() {
      this.store.commit(GeneralMutations.CHANGE_VISIBILE_VIEW, RouterNames.PLAY_GROUND);
    },
    switchMenu() {
      if (this.store.state.generalSettings.currentView == RouterNames.PLAY_GROUND) {
        this.store.commit(
          GeneralMutations.CHANGE_VISIBILE_VIEW,
          RouterNames.PLAY_GROUND_USERS
        );
      } else {
        this.store.commit(GeneralMutations.CHANGE_VISIBILE_VIEW, RouterNames.PLAY_GROUND);
      }
    },
  },
});
</script>
