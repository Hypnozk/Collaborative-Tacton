<template>
  <Layout>
    <div class="devices-page">
      <div v-if="deviceList.length > 0">
        <BaseRow>
          <BaseHeadline size="small"> List of Devices: </BaseHeadline>
        </BaseRow>

        <DeviceComponent
          v-for="device in deviceList"
          :key="device[DEVICE_INFO.id] + Math.random() * 101"
          :device="device"
        />
      </div>

      <BaseRow>
        <BaseButton class="scan-button" @click="toggleScanning">
          {{ isScanning ? "Stop Scan" : "Start Scanning" }}
        </BaseButton>
      </BaseRow>
    </div>
  </Layout>
</template>


<script>
import DeviceComponent from "@/renderer/components/bluetoothDevices/DeviceComponent";
import { mapGetters } from "vuex";
import { DEVICE_INFO } from "@/electron/lib/DEVICE_INFO";
import { IPC_CHANNELS } from "@/electron/IPCManager/IPCChannels";
import Layout from "../layouts/main.vue";

export default {
  name: "BluetoothDevice",
  components: {
    DeviceComponent,
    Layout
  },
  mounted() {
    this.startListening();
  },
  data() {
    return {
      DEVICE_INFO,
      isScanning: false,
    };
  },
  computed: {
    ...mapGetters("devices", ["deviceList"]),
  },
  methods: {
    toggleScanning() {
      //start bluetoot scanning
      console.log("New scanning status: " + !this.isScanning);
      this.isScanning = !this.isScanning;
       window.api.send(IPC_CHANNELS.send.output.scanning, this.isScanning);
    },
    startListening() {
      window.api.receive(IPC_CHANNELS.receive.output.devices, (arg) => {
        console.log(arg); // prints "pong"
      });
      window.api.receive(IPC_CHANNELS.receive.output.scanning, (arg) => {
        console.log("setScanning status :" + arg);
        this.isScanning = arg;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: grid;
  grid-template-columns: 15% 15% 15% 20% 35%;
  gap: 1.5em;
  grid-template-areas: "add save load toggle intensity";
  height: 100%;
  width: 85vw;
  margin-bottom: 10px;
}
</style>
