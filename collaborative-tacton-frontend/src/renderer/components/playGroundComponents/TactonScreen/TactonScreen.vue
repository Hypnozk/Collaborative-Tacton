<template>
  <v-row
    no-gutters
    align="center"
    style="justify-content: space-evenly; margin: 5px 0"
    id="tactonHeader"
  >
    <v-col style="max-width: fit-content">
      <v-btn @click="changeRecordMode" color="primary">
        {{ store.state.roomSettings.isRecording ? "Stop" : "Start" }} Record
      </v-btn>
    </v-col>
    <v-col style="max-width: fit-content">
      <v-row align="center">
        Duration:
        <v-select
          class="durationBox"
          :items="items"
          v-model="duration"
          :disabled="store.state.roomSettings.isRecording"
        ></v-select>
      </v-row>
    </v-col>
    <v-col style="max-width: fit-content">
      <v-btn @click="saveTacton" color="primary"> Save </v-btn>
    </v-col>
  </v-row>
  <TactonGraph :isMounted="isMounted" />
</template>

<style lang="scss">
.durationBox {
  padding-left: 10px;
  max-width: 100px;
  .v-input__control {
    height: 40px !important;
    max-height: 40px !important;
    display: flex;
    .v-field {
      .v-label {
        display: none;
      }
      .v-field__append-inner {
        display: flex;
        height: 40px !important;
        align-items: center;
        padding-top: 0;
      }
      .v-field__field {
        height: 40px !important;
        max-height: 40px !important;
        display: flex;
        padding-top: 0;
      }
    }
  }
  .v-input__details {
    display: none;
  }
}
</style>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "@/renderer/store/store";
import { sendSocketMessage } from "@/renderer/CommunicationManager/WebSocketManager";
import { WS_MSG_TYPE } from "@/renderer/CommunicationManager/WebSocketManager/ws_types";
import TactonGraph from "./TactonGraph.vue";

export default defineComponent({
  name: "TactonScreen",
  components: {
    TactonGraph,
  },
  props: {
    isMounted: {
      type: Boolean,
    },
  },
  data() {
    return {
      store: useStore(),
      items: ["5s", "10s", "15s"],
    };
  },
  computed: {
    maxDurationStore(): number {
      return this.store.state.roomSettings.maxDuration;
    },
    duration: {
      get(): string {
        return (this.maxDurationStore / 1000).toString() + "s";
      },
      set(newValue: any) {
        sendSocketMessage(WS_MSG_TYPE.CHANGE_DURATION_SERV, {
          roomId: this.store.state.roomSettings.id,
          duration: newValue.substring(0, newValue.length - 1) * 1000,
        });
      },
    },
  },
  methods: {
    changeRecordMode() {
      if (this.store.state.roomSettings.isRecording) {
        sendSocketMessage(WS_MSG_TYPE.UPDATE_RECORD_MODE_SERV, {
          roomId: this.store.state.roomSettings.id,
          shouldRecord: false,
        });
      } else {
        sendSocketMessage(WS_MSG_TYPE.UPDATE_RECORD_MODE_SERV, {
          roomId: this.store.state.roomSettings.id,
          shouldRecord: true,
        });
      }
    },
    saveTacton() {
      sendSocketMessage(WS_MSG_TYPE.GET_TACTON_SERV, {
        roomId: this.store.state.roomSettings.id,
        shouldRecord: false,
      });
    },
  },
});
</script>
