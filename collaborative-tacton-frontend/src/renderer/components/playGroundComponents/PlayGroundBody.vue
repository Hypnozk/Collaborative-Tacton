<template>
  <v-container class="playGroundView" ref="container" tabindex="-1">
    <v-row no-gutters>
      <v-col cols="4" id="tactonScreen">
        <TactonScreen :isMounted="isMounted" />
      </v-col>
      <v-divider vertical />
      <v-col cols="8">
        <GridHeader @openDialog="startDialog" />
        <GridArea @editButton="startDialog" />
      </v-col>
    </v-row>

    <v-dialog
      v-model="playGroundDialog"
      max-width="50%"
      class="tesing"
      @click:outside="closeDialog"
    >
      <PlayGroundDialog
        @closeDialog="closeDialog"
        :keyButtonId="idOfEditableButton"
      />
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

.playGroundView:focus {
  outline: none;
}
</style>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import GridArea from "./GridArea.vue";
import GridHeader from "./GridHeader.vue";
import TactonScreen from "./TactonScreen.vue";
import PlayGroundDialog from "./PlayGroundDialog.vue";
import { GeneralMutations } from "../../store/modules/generalSettings/generalSettings";
import { RouterNames } from "@/types/Routernames";
import { useStore } from "../../store/store";
import {PlayGroundMutations} from "../../store/modules/playGround/types"

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
      store: useStore(),
      playGroundDialog: false,
      idOfEditableButton: "",
      isMounted: false,
    };
  },
  mounted() {
    const container: any = this.$refs.container;
    this.$nextTick(() => container.$el.focus());
    this.isMounted = true;
    this.store.commit(PlayGroundMutations.UPDATE_EDIT_MDOE, false);
  },
  methods: {
    closeDialog() {
      this.playGroundDialog = false;
      this.store.commit(
        GeneralMutations.CHANGE_VISIBILE_VIEW,
        RouterNames.PLAY_GROUND
      );
      // set the focus again, so key down and up is working
      const container: any = this.$refs.container;
      this.$nextTick(() => container.$el.focus());
    },
    startDialog(id: string) {
      //console.log("startDialog: " + id);
      this.store.commit(
        GeneralMutations.CHANGE_VISIBILE_VIEW,
        RouterNames.PLAY_GROUND_DIALOG
      );
      this.idOfEditableButton = id;
      this.playGroundDialog = true;
    },
  },
});
</script>