<!-- Component for the setup -->
<!-- display metadata of the room, connecting with vibrotactile device -->

<template>
  <v-container class="setupView">
    <v-row class="subRow title">
      {{ `${store.state.roomSettings.roomState} Room` }}
    </v-row>
    <v-row class="subRow">
      <v-col cols="2" style="paddingtop: 25px; paddingleft: 60px">Name</v-col>
      <v-col cols="5">
        <v-text-field
          variant="underlined"
          hide-details="auto"
          no-resize
          v-model="roomName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="subRow">
      <v-col cols="2" style="paddingtop: 25px; paddingleft: 60px"
        >Description</v-col
      >
      <v-col cols="5">
        <v-textarea
          variant="underlined"
          hide-details="auto"
          no-resize
          rows="3"
          v-model="description"
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row class="subRow">
      <v-col cols="2" style="paddingtop: 25px; paddingleft: 60px"
        >Username</v-col
      >
      <v-col cols="5">
        <v-text-field
          variant="underlined"
          hide-details="auto"
          v-model="userName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="subRow">
      <v-col cols="2" style="paddingtop: 25px; paddingleft: 60px"
        >Connected Device</v-col
      >
      <v-col cols="5">
        {{ store.getters.getConnectedDevice?.name }}
      </v-col>
    </v-row>
    <v-divider />
    <v-row class="expandRow">
      <v-col cols="4" style="border-right: 1px solid rgba(0, 0, 0, .2);">
        <v-row no-gutters class="subheader"> Participants section </v-row>
        <ParticipantSection />
      </v-col>
      <v-col cols="8">
        <v-row>
          <v-row no-gutters class="subheader"> Device section </v-row>
          <DeviceSection />
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
    <v-row class="subRow" style="margin: 20px">
      <v-col cols="6">
        <v-row>
          <v-btn elevation="2" color="primary" @click="cancelRoomEnter">
            {{
              store.state.roomSettings.roomState == configureState
                ? "Log Out"
                : "Cancel"
            }}
          </v-btn>
          <v-spacer />
          <v-btn elevation="2" color="primary" @click="enterRoom">
            {{
              store.state.roomSettings.roomState == configureState
                ? "Finish Configuration"
                : "Enter Room"
            }}
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.setupView {
  display: flex;
  flex-direction: column;
  min-width: 100%;
  height: 100%;
  justify-content: center;
  font-size: 1.3em;
  flex-shrink: 0;
}
.title {
  justify-content: center;
  font-size: 1.5em;
  font-weight: bold;
  text-decoration: underline;
  padding-bottom: 20px;
}
.subheader {
  text-decoration: underline;
  justify-content: center;
  font-weight: bold;
  padding-bottom: 10px;
}
.subRow {
  flex: 0;
  margin: 0;
  justify-content: center;
}
.expandRow {
  margin: 0;
  flex-grow: 1;
  max-height: 50%;
}
</style>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "../store/store";
import router from "../router";
import {
  RoomMutations,
  RoomState,
} from "../store/modules/roomSettings/roomSettings";
import DeviceSection from "../components/deviceComponents/DeviceSection.vue";
import ParticipantSection from "../components/deviceComponents/ParticipantSection.vue";
import { sendSocketMessage } from "../CommunicationManager/WebSocketManager";
import { WS_MSG_TYPE } from "../CommunicationManager/WebSocketManager/ws_types";
import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";

export default defineComponent({
  name: "SetupView",
  components: {
    DeviceSection,
    ParticipantSection,
  },
  data() {
    return {
      configureState: RoomState.Configure,
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
    description: {
      get(): string {
        return this.store.state.roomSettings.description;
      },
      set(value: string) {
        this.store.commit(RoomMutations.UPDATE_ROOM_DESCRIPTION, value);
      },
    },
    userName: {
      get(): string {
        return this.store.state.roomSettings.user.name;
      },
      set(value: string) {
        this.store.commit(RoomMutations.UPDATE_USER_NAME, value);
      },
    },
  },
  methods: {
    cancelRoomEnter() {
      window.api.send(IPC_CHANNELS.main.changeScan, false);
      sendSocketMessage(WS_MSG_TYPE.LOG_OUT, {
        roomId: this.store.state.roomSettings.id,
        user: this.store.state.roomSettings.user,
      });
      router.push("/");
    },
    enterRoom() {
      window.api.send(IPC_CHANNELS.main.changeScan, false);
      window.api.send(IPC_CHANNELS.main.saveUserName, this.userName);
      if (this.store.state.roomSettings.roomState == RoomState.Configure) {
        sendSocketMessage(WS_MSG_TYPE.UPDATE_ROOM_SERV, {
          room: {
            id: this.store.state.roomSettings.id,
            name: this.store.state.roomSettings.roomName,
            description: this.description,
          },
          user: {
            id: this.store.state.roomSettings.user.id,
            name: this.store.state.roomSettings.user.name,
          },
        });
      } else {
        sendSocketMessage(WS_MSG_TYPE.ENTER_ROOM_SERV, {
          room: {
            id: this.store.state.roomSettings.id,
            name: this.store.state.roomSettings.roomName,
            description: this.description,
          },
          userName: this.userName,
        });
      }
    },
  },
});
</script>
