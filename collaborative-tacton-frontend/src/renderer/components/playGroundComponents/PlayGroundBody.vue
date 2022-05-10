<template>
  <v-container class="playGroundView">
    <v-dialog v-model="playGroundDialog" max-width="40%" class="tesing">
      <template v-slot:activator="{ props }">
        <v-row no-gutters>
          <v-col cols="4">
            <TactonScreen />
          </v-col>
          <v-col cols="8">
            <GridHeader :activator="props" />
            <GridArea />
          </v-col>
        </v-row>
      </template>
      <PlayGroundDialog @cancelDialog="closeDialog" :keyButtonId="idOfEditableButton"/>
    </v-dialog>
  </v-container>
</template>

<style lang="scss">
.playGroundView {
  display: flex;
  height: 100%;
  min-width: 100%;
  max-width: 100%;
  padding: 1px;
}
.v-overlay__content {
  width: 100%;
}
</style>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import GridArea from "./GridArea.vue";
import GridHeader from "./GridHeader.vue";
import TactonScreen from "./TactonScreen.vue";
import PlayGroundDialog from "./PlayGroundDialog.vue";
import RoomDialog from "../roomComponents/RoomDialog.vue";

export default defineComponent({
  name: "PlayGroundBody",
  components: {
    GridHeader,
    GridArea,
    TactonScreen,
    PlayGroundDialog,
  },
  data() {
    return {
      playGroundDialog: false,
      idOfEditableButton: "0"
    };
  },
  methods: {
    closeDialog() {
      console.log("closeDialog")
      this.playGroundDialog = false;
    },
  },
});
</script>