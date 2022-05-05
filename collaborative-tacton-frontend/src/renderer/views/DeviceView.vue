<template>
  <v-container fill-height class="deviceView">
    <v-row class="subRow">
      <v-btn elevation="2" color="primary" @click="startScanning">
        {{ isScanning ? "Stop" : "Start" }} Scanning
      </v-btn>
    </v-row>
    <v-row class="test"> ich bin irgendwas </v-row>
    <v-row class="subRow" style="justify-content: center">
      <v-col cols="6" class="pa-2">
        <v-btn elevation="2" color="primary" @click="cancelDevice">
          Cancel
        </v-btn>
      </v-col>
      <v-col cols="6" class="pa-2">
        <v-btn elevation="2" color="primary"> Finish Configuration </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.deviceView {
  display: flex;
  flex-direction: column;
  max-width: 100% !important;
  min-width: 100% !important;
  height: 100%;
  font-size: 1.5em;
  flex-shrink: 0;
}
.subRow {
  flex: 0;
  margin: 0;
}
.test {
  margin: 0;
  flex-grow: 1;
}
</style>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import router from "../router";
import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";

export default defineComponent({
  name: "DeviceView",
  data() {
    return {
      isScanning: false,
    };
  },
  methods: {
    cancelDevice() {
      router.push("/");
    },
    startScanning() {
      this.isScanning = !this.isScanning;
      window.api.send(IPC_CHANNELS.main.changeScan, this.isScanning);
    },
  },
});
</script>