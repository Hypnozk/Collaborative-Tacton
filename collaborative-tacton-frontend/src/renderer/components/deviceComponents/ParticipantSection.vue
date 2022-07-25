<template>
  <v-row
    v-for="(item, i) in participantList"
    :key="i"
    :value="item"
    no-gutters
    style="justify-content: center"
  >
    <v-col cols="2">
      <CustomProfile
        v-if="item.name !== ''"
        :letter="item.name.charAt(0).toUpperCase()"
        :color="item.color"
        :isFirstEntry="true"
        :clickable="false"
      />
      <DefaultProfile
        v-else
        :color="item.color"
        :isFirstEntry="true"
        :clickable="false"
      />
    </v-col>
    <v-col cols="7" style="padding-top: 4px">
      {{ item.name == "" ? "Guest" : item.name }}
    </v-col>
  </v-row>
</template>

<style></style>
<script lang="ts">
import { useStore } from "@/renderer/store/store";
import { defineComponent } from "@vue/runtime-core";
import DefaultProfile from "../playGroundComponents/UserMenu/DefaultProfile.vue";
import CustomProfile from "../playGroundComponents/UserMenu/CustomProfile.vue";
export default defineComponent({
  name: "ParticipantSection",
  components: {
    DefaultProfile,
    CustomProfile,
  },
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
