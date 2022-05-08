<template>
  <v-col cols="3">{{ `Name: ${device.name}` }}</v-col>
  <v-col cols="3">{{ `Rssi: ${device.rssi}` }}</v-col>
  <v-col cols="3">{{ `Status: ${device.state}` }}</v-col>
  <v-col
    cols="1"
    style="display: flex; justify-content: flex-end"
    v-if="device.state == 'connected' ? true : false"
    ><v-btn @click="vibrateDevice" elevation="2" color="primary">Retry</v-btn>
  </v-col>
  <v-col style="display: flex; justify-content: flex-end"
    ><v-btn
      @click="changeConnectionStatus"
      elevation="2"
      color="primary"
    >
      {{ device.state == "connected" ? "Disconnect" : "Connect" }}</v-btn
    >
  </v-col>
</template>

<style lang="scss" scoped>
</style>


<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import {
  DeviceStatus,
  VibrotactileDevice,
} from "../../store/modules/generalSettings/generalSettings";
import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";
import { useStore } from "@/renderer/store/store";

export default defineComponent({
  name: "DeviceRow",
  props: {
    device: {
      type: Object as () => VibrotactileDevice,
      required: true,
    },
  },
  data() {
    return {
      store: useStore(),
    };
  },
  methods: {
    changeConnectionStatus() {
      console.log("changeConnectionStatus");
      if (this.device.state == DeviceStatus.connected) {
        window.api.send(IPC_CHANNELS.main.disconnectDevice);
      } else {
        window.api.send(IPC_CHANNELS.main.connectDevice, this.device.id);
      }
    },
    vibrateDevice() {
      console.log("vibrateDevice");
    },
  },
});
</script>