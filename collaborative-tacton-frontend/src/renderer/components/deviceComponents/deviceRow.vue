<template>
  <v-row no-gutters>
    <v-col cols="4">{{ `Name: ${device.name}` }}</v-col>
    <v-col cols="2">{{ `Rssi: ${device.rssi}` }}</v-col>
    <v-col cols="3">{{ `Status: ${device.state}` }}</v-col>
    <v-col
      style="display: flex; justify-content: flex-end"
      v-if="device.state == 'connected' ? true : false"
      ><v-btn @click="vibrateDevice" elevation="2" color="primary">
        <v-progress-circular
          v-if="isVibrating"
          indeterminate
          color="red"
          :size="20"
        ></v-progress-circular>
        Retry</v-btn
      >
    </v-col>
    <v-spacer />
    <v-col style="display: flex; justify-content: flex-end"
      ><v-btn @click="changeConnectionStatus" elevation="2" color="primary">
        {{ device.state == "connected" ? "Disconnect" : "Connect" }}</v-btn
      >
    </v-col>
  </v-row>
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
      isVibrating: false,
      store: useStore(),
    };
  },
  methods: {
    changeConnectionStatus() {
      if (this.device.state == DeviceStatus.connected) {
        window.api.send(IPC_CHANNELS.main.disconnectDevice);
      } else {
        window.api.send(IPC_CHANNELS.main.connectDevice, this.device.id);
      }
    },
    async vibrateDevice() {
      this.isVibrating = true;
      window.api.send(IPC_CHANNELS.main.executeTask, [
        {
          channelId: 0,
          intensity: 1,
        },
      ]);
      await new Promise((r) => setTimeout(r, 2000));

      window.api.send(IPC_CHANNELS.main.executeTask, [
        {
          channelId: 0,
          intensity: 0,
        },
      ]);
      this.isVibrating = false;
    },
  },
});
</script>