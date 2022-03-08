<template>
  <div class="direct-input-config-dialog">
    <BaseModalDialog :visible="visible" @close="$emit('close')">
      <BaseHeadline :variant="'dark'">{{
        editMode ? "Edit Button" : "Add Button"
      }}</BaseHeadline>
      <div class="content">
        <BaseLabeledInput
          class="name"
          :model-value="editableButton.name"
          :label="'Name'"
          invert-color
          :variant="'dark'"
          @update="editableButton.name = $event"
        />
        <intensity
          class="intenstity"
          :label="'Intensity'"
          :value="editableButton.intensity.toString()"
          :variant="'dark'"
          @update="editableButton.intensity = $event"
        />
        <!-- Key Selector -->
        <KeySelector
          :selected-key="editableButton.key"
          @selectKey="selectKey"
        />
        <color-picker v-model="color" class="color" />
        <!-- Select Channels Field -->
        <div class="list">
          <div v-for="actuator in actuators" :key="actuator.i">
            <keyboard-button-config
              class="item"
              :color="color"
              :button="actuator"
              :selected="
                editableButton.selectedActuators.includes(actuator.key)
              "
              @select="selectActuator"
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
                disabled:
                  editableButton.key === '' ||
                  editableButton.selectedActuators.length == 0,
              }"
              :disabled="
                editableButton.key === '' ||
                editableButton.selectedActuators.length == 0
              "
              @click="
                $emit('confirm', {
                  key: button.key,
                  config: editableButton,
                })
              "
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
import { mapGetters } from "vuex";
import { Twitter } from "@ckpack/vue-color";
import { computed, ref, watch } from "vue";

export default {
  name: "ConfigDialog",
  components: {
    "color-picker": Twitter,
    Intensity,
    KeyboardButtonConfig,
    KeySelector,
  },
  props: {
    button: {
      type: Object,
      default: () => {
        return {
          color: "#0693E3",
          name: "",
          intensity: 1,
          key: "",
          selectedActuators: [],
        };
      },
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close", "confirm", "delete"],
  setup(props) {
    var editableButton = ref({
      color: "#0693E3",
      name: "",
      intensity: 1,
      key: "",
      selectedActuators: [],
    });
    watch(
      () => props.visible,
      () => {
        editableButton.value = JSON.parse(
          JSON.stringify({
            color: "#2188E8",
            name: "",
            intensity: 1,
            key: "",
            selectedActuators: [],
          })
        );
        editableButton.value = JSON.parse(JSON.stringify(props.button));
      }
    );

    const color = computed({
      get() {
        return editableButton.value.color;
      },
      set(newValue) {
        editableButton.value.color = newValue.hex;
      },
    });

    const selectActuator = (actuator) => {
      if (editableButton.value.selectedActuators.includes(actuator)) {
        const index = editableButton.value.selectedActuators.indexOf(actuator);
        if (index > -1) editableButton.value.selectedActuators.splice(index, 1);
      } else editableButton.value.selectedActuators.push(actuator);
    };

    const selectKey = (key) => {
      editableButton.value.key = key;
    };

    return { editableButton, color, selectActuator, selectKey };
  },
  computed: {
    actuators() {
      const actuators = [];
      for (var i = 0; i < this.numberOfOutputs; i++) {
        actuators.push({
          key: i,
          selected: false,
        });
      }
      return actuators;
    },
    ...mapGetters("devices", ["numberOfOutputs"]),
  },
};
</script>

<style scoped lang="scss">
.content {
  display: grid;
  grid-template-columns: 100%;
  grid-auto-flow: row;
  grid-template-areas:
    "name"
    "intensity"
    "key"
    "color"
    "channels"
    "buttons";
  padding: 10px;
  width: 100%;
}
.name {
  grid-area: name;
  padding-right: 12%;
}
.intensity {
  grid-area: intensity;
}
.color {
  grid-area: color;
  margin-bottom: 15px;
}
.key {
  grid-area: key;
  padding-right: 12%;
}
.channels {
  grid-area: channels;
}
.buttons {
  grid-area: buttons;
  margin-top: 10px;
  text-align: justify;

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
