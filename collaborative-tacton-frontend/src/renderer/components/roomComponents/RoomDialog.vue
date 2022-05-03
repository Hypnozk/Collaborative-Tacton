<template>
     <v-card>
      <v-card-title class="text-h5">
        Use Google's location service?
      </v-card-title>
      <v-card-text
        >Let Google help apps determine location. This means sending anonymous
        location data to Google, even when no apps are running.</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="cancelDialog">
          Disagree
        </v-btn>
        <v-btn color="green darken-1" text @click="cancelDialog"> Agree </v-btn>
      </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
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
  },
});
</script>