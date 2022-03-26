<template>
  <div>
    <div class="header">
      <BaseButton
        class="add"
        :class="{ disabled: !editModeActive }"
        :disabled="!editModeActive"
        @click="dialogVisible = true"
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
    </div>
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
      :button="customButton"
      :visible="dialogVisible"
      @update:button="updateButton"
      @close="closeDialog"
      @confirm="addButton"
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
      customButton: {
        color: "#0693E3",
        name: "",
        intensity: 1,
        key: "",
        selectedActuators: [],
      },
      dialogVisible: false,
    };
  },

  computed: {
    ...mapGetters("directInput", [
      "activeChannels",
      "globalIntensity",
      "gridColNum",
      "gridLayout",
      "keyAlreadyActive",
    ]),
    ...mapGetters("viewPort", ["editModeActive"]),
  },
  methods: {
    ...mapActions("directInput", [
      "addButtonToGrid",
      "deleteButtonFromGrid",
      "editButtonFromGrid",
      "setGlobalIntensity",
    ]),
    ...mapActions("viewPort", ["changeEditModeActive"]),
        resetButton() {
      this.customButton = {
        color: "#0693E3",
        name: "",
        intensity: 1,
        key: "",
        selectedActuators: [],
      };
    },
    addButton({ config }: any) {
      this.addButtonToGrid({
        channels: config.selectedActuators,
        color: config.color,
        intensity: config.intensity,
        name: config.name,
        key: config.key,
        w: 1,
        x: 1,
        y: 1,
        h: 1,
      });
      this.resetButton();
      this.dialogVisible = false;
    },
    updateButton(button: any) {
      this.customButton = button;
    },
    confirmEditedButton({ key, config }: any) {
      this.editButtonFromGrid({ key, config });
      this.resetButton();
      this.dialogVisible = false;
    },
    deleteButton(key: string) {
      this.deleteButtonFromGrid(key);
      this.resetButton();
      this.dialogVisible = false;
    },
    editButton(id: string) {
      const item = this.gridLayout.find((item: any) => item.i === id);
      this.customButton = {
        color: item.color,
        name: item.name,
        intensity: item.intensity,
        key: item.key,
        selectedActuators: item.channels,
      };
      this.dialogVisible = true;
    },
    setIntensity(intensity: number) {
      this.setGlobalIntensity(intensity);
      // changeGlobalIntensity();
    },
    toggleEditMode(active: boolean) {
      this.changeEditModeActive(active);
    },
    closeDialog() {
      this.resetButton();
      this.dialogVisible = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  gap: 1.5em;
  grid-template-areas: "add save load toggle intensity";
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