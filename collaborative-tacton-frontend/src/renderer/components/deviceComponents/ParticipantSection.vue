<template>
  <v-list>
    <v-list-item
      v-for="(item, i) in store.state.roomSettings.participants"
      :key="i"
      :value="item"
      active-color="primary"
      disabled
    >
      <div v-if="item.id !== store.state.roomSettings.user.id">
        <v-list-item-avatar start>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-title v-text="item.name"></v-list-item-title>
      </div>
    </v-list-item>
  </v-list>
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

