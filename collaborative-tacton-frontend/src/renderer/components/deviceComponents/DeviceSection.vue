<template>
  <v-container fill-height class="deviceView">
    <v-row class="subRow">
      <v-btn elevation="2" color="primary" @click="startScanning">
        <v-progress-circular
          v-if="isScanning"
          indeterminate
          color="red"
          :size="20"
          style="margin-right: 10px"
        ></v-progress-circular>
        {{ isScanning ? "Stop" : "Start" }} Scanning
      </v-btn>
    </v-row>
    <v-row class="test">
      <v-container class="listSection">
        <v-list-item v-for="item in deviceList" :key="item.id">
          <DeviceRow :device="item" />
        </v-list-item>
      </v-container>
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
  font-size: 0.8em;
  flex-shrink: 0;
}

.listSection {
  margin: 0;
  padding: 0;
  max-width: 100% !important;
  min-width: 100% !important;
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
import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";
import DeviceRow from "./deviceRow.vue";
import { useStore } from "../../store/store";
import { VibrotactileDevice } from "../../store/modules/generalSettings/generalSettings";
import { GeneralMutations } from "../../store/modules/generalSettings/generalSettings";

export default defineComponent({
  components: { DeviceRow },
  name: "DeviceSection",
  data() {
    return {
      isScanning: false,
      store: useStore(),
    };
  },
  computed: {
    deviceList(): VibrotactileDevice[] {
      return this.store.state.generalSettings.deviceList;
    },
  },
  methods: {
    startScanning() {
      this.isScanning = !this.isScanning;
      if (this.isScanning)
        this.store.commit(GeneralMutations.UPDATE_DEVICE_LIST, []);
        
      window.api.send(IPC_CHANNELS.main.changeScan, this.isScanning);
    },
  },
});
</script>