<template>
  <div class="about">
    <BaseButton
      class="Start Scanning"
      @click="startScanning"
    >
      Add button
    </BaseButton>
    <div>Scanning is {{ isScanning }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import {IPC_CHANNELS} from "@/electron/IPCManager/IPCChannels";

export default defineComponent({
  name: "DeviceView",
  data() {
    return {
      isScanning: false,
    };
  },
  methods: {
    startScanning() {
      this.isScanning = !this.isScanning;
      window.api.send(IPC_CHANNELS.main.changeScan, this.isScanning);
    },
  },
});
</script>