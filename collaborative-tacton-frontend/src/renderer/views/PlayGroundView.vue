<!-- Component for the playGround -->
<!-- display the time profiles and the buttons to control the vibrotactile device -->
<template>
  <PlayGroundHeader />
  <PlayGroundBody />
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import PlayGroundBody from "../components/playGroundComponents/PlayGroundBody.vue";
import PlayGroundHeader from "../components/playGroundComponents/PlayGroundHeader.vue";

export default defineComponent({
  name: "PlayGroundView",
  components: {
    PlayGroundBody,
    PlayGroundHeader,
  },
});
</script>