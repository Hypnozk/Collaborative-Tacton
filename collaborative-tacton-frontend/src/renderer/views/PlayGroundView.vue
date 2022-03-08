<template>
  <div
    tabindex="0"
    class="direct-input"
    @keyup="buttonUp"
    @keydown="buttonDown"
  >
      <BaseButton
        class="add"
        :class="{ disabled: !editModeActive }"
        :disabled="!editModeActive"
        @click="addDialogVisible = true"
      >
        Add button
      </BaseButton>
      <div class="toggle">
        <BaseText class="play" :variant="'light'">Play</BaseText>
        <BaseToggleIcon
          :value="editModeActive"
          :icon-size="50"
          @update="toggleEditMode"
        />
        <BaseText class="edit" :variant="'light'">Edit</BaseText>
      </div>
      <Intensity
        class="intensity"
        :label="'global intensity'"
        :value="globalIntensity.toString()"
        :variant="'light'"
        @update="setIntensity($event)"
      />
    <PlayGround>
      <template #button-content="{ item }">
        <keyboard-button
          :edit-mode-active="editModeActive"
          :global-intensity="globalIntensity"
          :button="item"
          @edit="editButton"
        />
      </template>
    </PlayGround>
    <ConfigDialog
      :visible="addDialogVisible"
      @close="addDialogVisible = false"
      @confirm="addButton"
    />
    <ConfigDialog
      :button="buttonToEdit"
      edit-mode
      :visible="editDialogVisible"
      @close="editDialogVisible = false"
      @confirm="confirmEditedButton"
      @delete="deleteButton"
    />
  </div>
</template>

<script lang="ts">
import ConfigDialog from "@/renderer/components/playGround/configDialog.vue";
import PlayGround from "@/renderer/components/playGround/playGround.vue";
import Intensity from "@/renderer/components/playGround/intensity.vue";
import KeyboardButton from "@/renderer/components/playGround/keyboardButton.vue";
import { mapActions, mapGetters } from "vuex";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "DirectInput",
  components: {
    ConfigDialog,
    PlayGround,
    Intensity,
    KeyboardButton,
  },
  data() {
    return {
      addDialogVisible: false,
      buttonToEdit: undefined as any,
      editDialogVisible: false,
    };
  },

  computed: {
    anyDialogOpen(): boolean {
      return this.addDialogVisible || this.editDialogVisible;
    },
    ...mapGetters("directInput", [
      "activeChannels",
      "editModeActive",
      "globalIntensity",
      "gridColNum",
      "gridLayout",
      "keyAlreadyActive",
    ]),
  },
  methods: {
        ...mapActions("directInput", [
      "addButtonToGrid",
      "addActiveKey",
      "deleteButtonFromGrid",
      "editButtonFromGrid",
      "removeActiveKey",
      "setEditModeActive",
      "setGlobalIntensity",
    ]),
    addButton({ config }:any) {
      this.addButtonToGrid({
        channels: config.selectedActuators,
        color: config.color,
        intensity: config.intensity,
        name: config.name,
        key: config.key,
        w:1,
        x:1,
        y:1,
        h:1,
      });
      this.addDialogVisible = false;
    },
    buttonDown(e: any) {
      const key = e.key.toUpperCase();
      if (this.anyDialogOpen || this.keyAlreadyActive(key)) return;
      const item = this.gridLayout.find(
        (item: any) => item.key.toUpperCase() === key
      );
      if (item && !this.editModeActive) {
        // activateChannels(item.channels, item.intensity);
        this.addActiveKey(key);
      }
    },
    buttonUp(e: any) {
      const key = e.key.toUpperCase();
      if (this.anyDialogOpen || !this.keyAlreadyActive(key)) return;
      const item = this.gridLayout.find(
        (item: any) => item.key.toUpperCase() === key
      );
      if (item && !this.editModeActive) {
        //deactivateChannels(item.channels, item.intensity);
        this.removeActiveKey(key);
      }
    },
    confirmEditedButton({ key, config }: any) {
      this.editButtonFromGrid({ key, config });
      this.editDialogVisible = false;
    },
    deleteButton(key: string) {
      this.deleteButtonFromGrid(key);
      this.editDialogVisible = false;
    },
    editButton(id: string) {
      const item = this.gridLayout.find((item:any) => item.i === id);
      this.buttonToEdit = {
        color: item.color,
        name: item.name,
        intensity: item.intensity,
        key: item.key,
        selectedActuators: item.channels,
      };
      this.editDialogVisible = true;
    },
    setIntensity(intensity: number) {
      this.setGlobalIntensity(intensity);
      // changeGlobalIntensity();
    },
    toggleEditMode(active: boolean) {
      this.setEditModeActive(active);
    },
  },
});
</script>

<style lang="scss" scoped>
.direct-input {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  gap: 1.5em;
  grid-template-areas: "add save load toggle intensity";
  height: 100%;
  width: 85vw;
  margin-bottom: 10px;
  align-items: center;
}
.add {
  grid-area: add;
  width: 100px;
  height: 30px;
  justify-self: center;
}
.save {
  grid-area: save;
}
.load {
  grid-area: load;
}
.toggle {
  display: grid;
  justify-content: center;
  grid-template-columns: 50px 50px 50px;
  gap: 10px;
  height: 100%;
  text-align: middle;
  margin-left: 40px;
}
.play {
  padding-left: 15px;
}
.edit {
  margin-left: 5px;
}
</style>