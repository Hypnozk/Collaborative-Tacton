<template>
  <v-container class="playGroundView" ref="container" tabindex="-1">
    <v-row no-gutters>
      <v-col cols="5" id="tactonScreen">
        <TactonScreen :isMounted="isMounted" />
      </v-col>
      <v-col>
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
  height: 90%;
  min-width: 100%;
  max-width: 100%;
  padding: 0;
}

.playGroundView:focus {
  outline: none;
}

#tactonScreen{
  border-right: 1px solid rgba(0, 0, 0, .2);;
}
</style>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import GridArea from "./GridArea/GridArea.vue";
import GridHeader from "./GridArea/GridHeader.vue";
import TactonScreen from "./TactonScreen/TactonScreen.vue";
import PlayGroundDialog from "./PlayGroundDialog.vue";
import { GeneralMutations } from "../../store/modules/generalSettings/generalSettings";
import { RouterNames } from "@/types/Routernames";
import { useStore } from "../../store/store";
import { PlayGroundMutations } from "../../store/modules/playGround/types";

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
    //set the focus to the gui, so key down and up is working
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