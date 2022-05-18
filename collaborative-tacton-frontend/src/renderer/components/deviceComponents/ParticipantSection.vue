<template>
  <v-row no-gutters>
    <v-col cols="1">
      {{ store.state.roomSettings.participants.length }}
    </v-col>
    <v-col cols="3"> Participants </v-col>
  </v-row>
  <v-row>
    <v-list>
      <v-list-item
        v-for="(item, i) in store.state.roomSettings.participants"
        :key="i"
        :value="item"
        active-color="primary"
      >
        <v-list-item-avatar start>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-title v-text="item.userName"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-row>
</template>

<style>
</style>
<script lang="ts">
import { useStore } from "@/renderer/store/store";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "ParticipantSection",
  data() {
    return {
      store: useStore(),
    };
  },
});
</script>

