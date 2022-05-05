<template>
  <v-container class="roomDialog">
    <v-row class="title">
      {{ roomName }}
    </v-row>
    <v-row>
      <v-col cols="6"> Description </v-col>
      <v-col cols="6">
        im a filler kflhalkvblakdvbapd hjbvalvönaövdbjadövlhnabjvlösdv
        sdlfhnklasfb
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6"> Own vibrotactile Display </v-col>
      <v-col cols="6"> im a filler </v-col>
    </v-row>
    <v-row>
      <v-col cols="6"> Participants list </v-col>
      <v-col cols="6"> {{ store.state.roomSettings.participants }} </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-btn elevation="2" color="primary" @click="cancelDialog">
          Cancel
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn elevation="2" color="primary" @click="enterDeviceView"
          >Change Device</v-btn
        >
      </v-col>
      <v-col cols="3">
        <v-btn elevation="2" color="primary"> Enter Room </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.roomDialog {
  background-color: white;
  align-items: center;
  font-weight: bold;
  border-radius: 20px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
.title {
  justify-content: center;
  font-size: 1.5em;
  text-decoration: underline;
  margin-bottom: 20px;
}
</style>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import router from "../../router";
import { useStore } from "../../store/store";
import { MutationTypes } from "../../store/modules/roomSettings/roomSettings";
import { GeneralSettingsActionTypes } from "../../store/modules/generalSettings/generalSettings";
import { RouterNames } from "@/types/Routernames";

export default defineComponent({
  name: "RoomDialog",
  data() {
    return {
      userName: "",
      store: useStore(),
    };
  },
  computed: {
    roomName: {
      get(): string {
        return this.store.state.roomSettings.name;
      },
      set(value: string) {
        this.store.commit(MutationTypes.UPDATE_ROOM_NAME, value);
      },
    },
  },
  methods: {
    cancelDialog() {
      this.store.dispatch(
        GeneralSettingsActionTypes.changeCurrentView,
        RouterNames.ROOM
      );
    },
    enterDeviceView() {
      router.push("/device");
    },
  },
});
</script>