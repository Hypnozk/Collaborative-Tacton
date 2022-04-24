<template>
  <div class="direct-input-config-dialog">
    <BaseModalDialog :visible="visible" @close="$emit('close')">
      <BaseHeadline :variant="'dark'">{{ "Configure Button" }}</BaseHeadline>
      <div class="contentConfigDialog">
        <BaseLabeledInput
          class="name"
          :model-value="button.name"
          :label="'Name'"
          invert-color
          :variant="'dark'"
          @update="updateButtonName"
        />
        <intensity
          class="intenstity"
          :label="'Intensity'"
          :value="button.intensity.toString()"
          :variant="'dark'"
          @update="updateButtonIntensity"
        />
        <!-- Key Selector -->
        <KeySelector :selected-key="button.key" @selectKey="selectKey" />
        <color-picker v-model="colorCustom" class="color" />
        <!-- Select Channels Field -->
        <div class="list">
          <div v-for="actuator in actuators" :key="actuator.i">
            <keyboard-button-config
              class="item"
              :color="colorCustom.hex8"
              :buttonKey="actuator.key"
              :isSelected="button.channels.includes(actuator.key)"
              @select="selectActuators"
            />
          </div>
        </div>
        <div class="buttons">
          <BaseRow>
            <BaseButton @click="$emit('close')">Cancel</BaseButton>
            <BaseButton v-show="editMode" @click="$emit('delete', button.key)">
              Delete
            </BaseButton>
            <BaseButton
              :class="{
                disabled: button.key === '' || button.channels.length == 0,
              }"
              :disabled="button.key === '' || button.channels.length == 0"
              @click="$emit('confirm', { ...button, color: colorCustom.hex8 })"
            >
              Confirm
            </BaseButton>
          </BaseRow>
        </div>
      </div>
    </BaseModalDialog>
  </div>
</template>

<script>
import Intensity from "./intensity.vue";
import KeyboardButtonConfig from "./buttonConfig.vue";
import KeySelector from "./keySelector.vue";
import { Twitter } from "@ckpack/vue-color";
import { useStore } from "@/renderer/store/store";

export default {
  name: "ConfigDialog",
  components: {
    "color-picker": Twitter,
    Intensity,
    KeyboardButtonConfig,
    KeySelector,
  },
  data() {
    return {
      store: useStore(),
      colorCustom: { hex8: this.button.color },
    };
  },
  props: {
    button: {
      type: Object,
      required: true,
    },
    editMode: {
      type: Boolean,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close", "confirm", "delete", "update:button"],
  methods: {
    updateButtonName(nameButon) {
      const modifiedButton = { ...this.button, name: nameButon };
      this.$emit("update:button", modifiedButton);
    },
    updateButtonIntensity(event) {
      this.$emit("update:button", { ...this.button, intensity: event });
    },
    selectActuators(actuator) {
      const channels = this.button.channels;
      if (this.button.channels.includes(actuator)) {
        const index = this.button.channels.indexOf(actuator);
        if (index > -1) {
          channels.splice(index, 1);
          const modifiedButton = {
            ...this.button,
            channels: channels,
          };
          this.$emit("update:button", modifiedButton);
        }
      } else {
        channels.push(actuator);
        const modifiedButton = {
          ...this.button,
          channels: channels,
        };
        this.$emit("update:button", modifiedButton);
      }
    },
    selectKey(key) {
      this.$emit("update:button", { ...this.button, key: key });
    },
  },
  computed: {
    actuators() {
      const actuators = [];
      for (var i = 0; i < this.store.getters.numberOfOutputs; i++) {
        actuators.push({
          key: i,
          selected: false,
        });
      }
      return actuators;
    },
  },
};
</script>

<style scoped lang="scss">
.contentConfigDialog {
  display: flex;
  flex-direction: column;
  width: fit-content;
}

.buttons {
  grid-area: buttons;
  button {
    margin: 0 10px 0 10px;
  }
}
.list {
  display: grid;
  grid-template-columns: 90px 90px 90px 90px 90px 90px;
  grid-gap: 10px 0;
  grid-auto-flow: row;
}
.item {
  max-width: 100px;
  max-height: 100px;
}
</style>
