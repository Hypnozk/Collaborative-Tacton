<template>
  <v-row
    v-for="(item, i) in participantList"
    :key="i"
    :value="item"
    no-gutters
    style="justify-content: center"
  >
    <v-col cols="2">
      <v-icon style="opacity: 0.6; padding: 0">mdi-account-circle</v-icon>
    </v-col>
    <v-col cols="7">
      {{ item.name }}
    </v-col>
  </v-row>
</template>

<style></style>
<script lang="ts">
import { useStore } from "@/renderer/store/store";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "ParticipantSection",
  data: () => ({
    store: useStore(),
  }),
  computed: {
    participantList() {
      if (this.store.state.roomSettings.participants == undefined) return [];

      return this.store.state.roomSettings.participants.filter(
        (user) => user.id !== this.store.state.roomSettings.user.id
      );
    },
  },
});
</script>
