<template>
  <div>
    <div class="header">
      <BaseButton
        class="add"
        :class="{ disabled: !store.getters.editModeActive }"
        :disabled="!store.getters.editModeActive"
        @click="dialogVisible = true"
      >
        Add button
      </BaseButton>
      <div class="toggle">
        <BaseText class="play" :variant="'light'">Play</BaseText>
        <BaseToggleIcon
          :value="store.getters.editModeActive"
          :icon-size="50"
          @update="toggleEditMode"
        />
        <BaseText class="edit" :variant="'light'">Edit</BaseText>
      </div>
      <Intensity
        class="intensity"
        :label="'global intensity'"
        :value="store.getters.globalIntensity.toString()"
        :variant="'light'"
        @update="setIntensity($event)"
      />
    </div>
    <PlayGround>
      <template #button-content="{ item }">
        <keyboard-button
          :edit-mode-active="store.getters.editModeActive"
          :global-intensity="store.getters.globalIntensity"
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
import { defineComponent } from "@vue/runtime-core";
import { ActionTypes } from "../store/modules/directInput/actionTypes";
import { ActionTypes as ActionTypesViewPort } from "../store/modules/viewPort/viewPort";
import { useStore } from "../store/store";

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
      store: useStore(),
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
  methods: {
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
      this.store.dispatch(ActionTypes.addButtonToGrid, {
        channels: config.selectedActuators,
        color: config.color,
        intensity: config.intensity,
        name: config.name,
        key: config.key,
        h: 1,
        w: 1,
        x: 1,
        y: 1,
      });
      this.resetButton();
      this.dialogVisible = false;
    },
    updateButton(button: any) {
      this.customButton = button;
    },
    confirmEditedButton({ key, config }: any) {
      this.store.dispatch(ActionTypes.editButtonFromGrid, { key, config });
      this.resetButton();
      this.dialogVisible = false;
    },
    deleteButton(key: string) {
      this.store.dispatch(ActionTypes.deleteButtonFromGrid, key);
      this.resetButton();
      this.dialogVisible = false;
    },
    editButton(id: string) {
      const item = this.store.getters.gridLayout.find(
        (item: any) => item.i === id
      );
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
      this.store.dispatch(ActionTypes.setGlobalIntensity, intensity);
      // changeGlobalIntensity();
    },
    toggleEditMode(active: boolean) {
      this.store.dispatch(ActionTypesViewPort.changeEditModeActive, active);
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