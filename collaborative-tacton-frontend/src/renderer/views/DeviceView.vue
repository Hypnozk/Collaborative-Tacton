<template>
  <v-container fill-height class="deviceView">
    <v-row class="subRow">
      <v-btn elevation="2" color="primary" @click="startScanning">
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
    <v-row class="subRow" style="justify-content: center">
      <v-col cols="6" class="pa-2">
        <v-btn elevation="2" color="primary" @click="cancelDevice">
          Cancel
        </v-btn>
      </v-col>
      <v-col cols="6" class="pa-2">
        <v-btn elevation="2" color="primary" @click="finishConfiguration">
          Finish Configuration
        </v-btn>
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
import router from "../router";
import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";
import DeviceRow from "../components/deviceComponents/deviceRow.vue";
import { useStore } from "../store/store";
import { VibrotactileDevice } from "../store/modules/generalSettings/generalSettings";
import { MutationTypes } from "../store/modules/generalSettings/generalSettings";

export default defineComponent({
  components: { DeviceRow },
  name: "DeviceView",
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
    cancelDevice() {
      router.push("/");
    },
    finishConfiguration() {
      router.push("/playGround");
    },
    startScanning() {
      this.isScanning = !this.isScanning;
      this.store.commit(MutationTypes.UPDATE_DEVICE_LIST, []);
      window.api.send(IPC_CHANNELS.main.changeScan, this.isScanning);
    },
  },
});
</script>