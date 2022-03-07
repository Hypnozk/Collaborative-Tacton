<template>
  <div
      tabindex="0"
      class="direct-input"
      @keyup="buttonUp"
      @keydown="buttonDown"
    >
      <BaseRow class="row">
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
      </BaseRow>
      <DirectInputGrid>
        <template #button-content="{ item }">
          <keyboard-button
            :edit-mode-active="editModeActive"
            :global-intensity="globalIntensity"
            :button="item"
            @edit="editButton"
          />
        </template>
      </DirectInputGrid>
      <config-dialog
        :visible="addDialogVisible"
        @close="addDialogVisible = false"
        @confirm="addButton"
      />
      <config-dialog
        :button="buttonToEdit"
        edit-mode
        :visible="editDialogVisible"
        @close="editDialogVisible = false"
        @confirm="confirmEditedButton"
        @delete="deleteButton"
      />
    </div>

</template>


<script>
import ConfigDialog from "@/renderer/components/direct-input/config-dialog.vue";
import DirectInputGrid from "@/renderer/components/direct-input/grid.vue";
import Intensity from "@/renderer/components/direct-input/intensity.vue";
import KeyboardButton from "@/renderer/components/direct-input/button.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: 'DirectInput',
 components: {
    ConfigDialog,
    DirectInputGrid,
    Intensity,
    KeyboardButton,

  },
  data() {
    return {
      addDialogVisible: false,
      buttonToEdit: undefined,
      editDialogVisible: false,
    };
  },
  computed: {
    anyDialogOpen() {
      return (
        this.addDialogVisible ||
        this.editDialogVisible
      );
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
    addButton({ config }) {
      this.addButtonToGrid({
        channels: config.selectedActuators,
        color: config.color,
        intensity: config.intensity,
        name: config.name,
        key: config.key,
      });
      this.addDialogVisible = false;
    },
    buttonDown(e) {
      const key = e.key.toUpperCase();
      if (this.anyDialogOpen || this.keyAlreadyActive(key)) return;
      const item = this.gridLayout.find(
        (item) => item.key.toUpperCase() === key
      );
      if (item && !this.editModeActive) {
      // activateChannels(item.channels, item.intensity);
        this.addActiveKey(key);
      }
    },
    buttonUp(e) {
      const key = e.key.toUpperCase();
      if (this.anyDialogOpen || !this.keyAlreadyActive(key)) return;
      const item = this.gridLayout.find(
        (item) => item.key.toUpperCase() === key
      );
      if (item && !this.editModeActive) {
       //deactivateChannels(item.channels, item.intensity);
        this.removeActiveKey(key);
      }
    },
    confirmEditedButton({ key, config }) {
      this.editButtonFromGrid({ key, config });
      this.editDialogVisible = false;
    },
    deleteButton(key) {
      this.deleteButtonFromGrid(key);
      this.editDialogVisible = false;
    },
    editButton(id) {
      const item = this.gridLayout.find((item) => item.i === id);
      this.buttonToEdit = {
        color: item.color,
        name: item.name,
        intensity: item.intensity,
        key: item.key,
        selectedActuators: item.channels,
      };
      this.editDialogVisible = true;
    },
    setIntensity(intensity) {
      this.setGlobalIntensity(intensity);
     // changeGlobalIntensity();
    },
    toggleEditMode(active) {
      this.setEditModeActive(active);
    },
    ...mapActions("directInput", [
      "addButtonToGrid",
      "addActiveKey",
      "deleteButtonFromGrid",
      "editButtonFromGrid",
      "removeActiveKey",
      "setEditModeActive",
      "setGlobalIntensity",
    ]),
  },
};
</script>

<style lang="scss" scoped>
.row {
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
