<template>
  <v-container class="headerPlayGround">
    <v-row class="align-center">
      <v-col style="padding:0px 0px 0px 10px">
        Name of virtual room>#room ID
        <v-btn variant="text" icon="mdi-content-copy"> </v-btn>
      </v-col>
      <v-spacer></v-spacer>

      <v-menu class="customMenu" stlye="margin-right:5px">
        <template v-slot:activator="{ props }">
          <v-btn variant="text" v-bind="props"> {{ `Participants:` }} </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <div style="border: 1px solid #ddd" class="customField">
              <input style="padding: 5px" class="inputField" />
              <v-icon right> mdi-pencil </v-icon>
            </div>
          </v-list-item>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :value="index"
            class="customMenu"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn variant="text" style="margin-right: 20px">
        Log out <v-icon right> mdi-logout </v-icon></v-btn
      >
    </v-row>
  </v-container>
  <v-container class="playGroundView">
    <v-row class="test"> </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.headerPlayGround {
  min-width: 100% !important;
  max-width: 100% !important;
  border-bottom: 1px solid rgb(48, 41, 41);
}
.playGroundView {
  display: flex;
  height: 100%;
  min-width: 100% !important;
  max-width: 100% !important;
}

.customField:hover {
  border: solid !important;
  border-color: black !important;
  border-width: thin !important;
}

.customField:focus-within {
  border: solid !important;
  border-color: black !important;
  border-width: thin !important;
}

.inputField:hover {
  outline: none;
}

.inputField:focus {
  outline: none;
}

.customMenu {
  pointer-events: none;
}
.customMenu:hover {
  background-color: white;
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
  name: "PlayGroundView",
  data: () => ({
    items: [
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me 2" },
    ],
  }),
});
</script>