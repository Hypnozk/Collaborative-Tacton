<template>
  <v-dialog v-model="showRoomDialog" max-width="70%">
    <template v-slot:activator>
      <RoomLayout />
    </template>
    <RoomDialog />
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "../store/store";
import { MutationTypes } from "../store/modules/roomSettings/roomSettings";
import { GeneralSettingsActionTypes } from "../store/modules/generalSettings/generalSettings";
import { RouterNames } from "@/types/Routernames";
import RoomLayout from "../components/roomComponents/RoomLayout.vue";
import RoomDialog from "../components/roomComponents/RoomDialog.vue";

export default defineComponent({
  name: "RoomView",
  components: {
    RoomLayout,
    RoomDialog,
  },
  data() {
    return {
      userName: "",
      store: useStore(),
    };
  },
  computed: {
    showRoomDialog: {
      get(): boolean {
        return this.store.getters.showRoomDialog;
      },
      set() {
          console.log(this.store.state.roomSettings.name)
        this.store.dispatch(
          GeneralSettingsActionTypes.changeCurrentView,
          RouterNames.ROOM
        );
      },
    },
    roomName: {
      get(): string {
        return this.store.state.roomSettings.name;
      },
      set(value: string) {
        this.store.commit(MutationTypes.UPDATE_ROOM_NAME, value);
      },
    },
  }
});
</script>