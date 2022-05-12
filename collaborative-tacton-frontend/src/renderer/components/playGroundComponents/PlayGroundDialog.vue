<template>
  <v-container class="playDialog" @keydown="enterNewKey">
    <v-row justify="center">
      <v-col cols="2" align-self="center" style="margin-top: 10px">
        Name
      </v-col>
      <v-col cols="6">
        <v-text-field
          variant="underlined"
          hide-details="auto"
          v-model="name"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" style="margin-bottom: 10px">
      <v-col cols="2" align-self="center"> Key </v-col>
      <v-col cols="6">
        <v-row no-gutters>
          <v-col cols="7" align-self="center">
            <div>
              {{ key }}
            </div>
            <div class="errorField" v-if="keyIsTaken.oneTime">
              The Key is already taken.
            </div>
          </v-col>
          <v-col cols="5" style="display: flex; justify-content: flex-end">
            <v-btn elevation="2" color="primary" @click="startKeyDetection">
              <v-progress-circular
                v-if="isKeyDetecting"
                indeterminate
                color="red"
                :size="30"
                style="margin-right: 10px"
              ></v-progress-circular>
              <div>Detect</div>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="2" align-self="center"> Intensity </v-col>
      <v-col cols="6">
        <v-row no-gutters class="slider">
          <v-slider
            v-model="intensity"
            step="0.1"
            max="1"
            min="0"
            hide-details
            style="margin: 0px"
          />
          <div style="margin-left: 20px">
            {{ `${intensity * 100} %` }}
          </div>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center" style="margin-top: 10px">
      <v-col cols="2" align-self="center"> Color </v-col>
      <v-col cols="6">
        <v-color-picker
          v-model="color"
          mode="hex"
          hide-canvas
          style="margin-bottom: 500px !important"
        ></v-color-picker>
      </v-col>
    </v-row>
    <v-row class="pa-3">
      <div class="listChannels">
        <v-card
          v-for="(item, index) in channelActive"
          v-bind:key="index"
          class="actuator"
          @click="updateChannel(item, index)"
          v-bind:style="{ backgroundColor: colorActuator(index) }"
        >
          {{ index + 1 }}
        </v-card>
      </div>
    </v-row>
    <v-row no-gutters class="pa-3">
      <v-btn elevation="2" color="primary" @click="cancelDialog">
        Cancel
      </v-btn>
      <v-spacer />
      <v-btn elevation="2" color="primary" style="margin-right: 20px">
        Delete
      </v-btn>
      <v-btn elevation="2" color="primary"> Confirm </v-btn>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.playDialog {
  background-color: white;
  align-items: center;
  border-radius: 20px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.playDialog:focus {
  outline: none;
}
.listChannels {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;

  .actuator {
    justify-content: center;
    align-items: center;
    display: flex;
    min-width: 80px;
    min-height: 80px;
  }
}

.errorField {
  font-size: 0.8em;
  color: red;
}
.slider {
  justify-content: center;
  align-items: center;
}
</style>

<script lang="ts">
import { GeneralMutations } from "@/renderer/store/modules/generalSettings/generalSettings";
import { useStore } from "@/renderer/store/store";
import { RouterNames } from "@/types/Routernames";
import { defineComponent } from "@vue/runtime-core";
import { lightenDarkenColor } from "../../lib/colors";

export default defineComponent({
  name: "PlayGroundDialog",
  emits: ["cancelDialog"],
  props: {
    keyButtonId: {
      type: String,
    },
  },
  data() {
    return {
      store: useStore(),
      isKeyDetecting: false,
      keyIsTaken: { oneTime: false, always: false },
      name: "",
      key: "",
      intensity: 1,
      color: "#65FF00",
      channelActive: new Array(12).fill(false),
    };
  },
  mounted() {
    //console.log("this.keyButtonId: " +this.keyButtonId);

    this.store.commit(
      GeneralMutations.CHANGE_VISIBILE_VIEW,
      RouterNames.PLAY_GROUND_DIALOG
    );
    if (this.keyButtonId == undefined) return;
    const keyButton = this.store.getters.getKeyButton(this.keyButtonId);
    if (keyButton == undefined) return;

    //insert values in dialog of found button
    if (keyButton.name !== undefined) this.name = keyButton.name;
    this.key = keyButton.key;
    this.intensity = keyButton.intensity;
    this.color = keyButton.color;
    keyButton.channels.forEach((element) => {
      this.channelActive[element] = true;
    });
  },
  computed: {
    colorActuator() {
      return (index: number) => {
        if (this.channelActive[index])
          return lightenDarkenColor(this.color, -100);
        return this.color;
      };
    },
  },
  methods: {
    cancelDialog() {
      this.$emit("cancelDialog");
    },
    updateChannel(currentState: boolean, index: number) {
      this.channelActive[index] = !currentState;
    },
    stopKeyDetection() {
      console.log("stopKeyDetection");
      if (this.keyIsTaken.oneTime) {
        //start the timer again if user selected taken key
        if (!this.keyIsTaken.always) {
          this.keyIsTaken = { oneTime: false, always: true };
          const refStopKeyDetection = this.stopKeyDetection;
          setTimeout(refStopKeyDetection, 5000);
        }
      }
      this.isKeyDetecting = false;
    },
    startKeyDetection() {
      if (this.isKeyDetecting) return;
      this.keyIsTaken = { oneTime: false, always: false };
      this.isKeyDetecting = true;
      const refStopKeyDetection = this.stopKeyDetection;
      setTimeout(refStopKeyDetection, 5000);
    },
    enterNewKey(e: any) {
      //check if user want to enter key
      if (!this.isKeyDetecting) return;

      const newKey = e.key.toUpperCase();

      this.key = newKey;
      //key is already taken
      if (this.store.getters.isKeyAlreadyTaken(this.keyButtonId, newKey)) {
        this.keyIsTaken = { oneTime: true, always: false };
        return;
      }

      this.isKeyDetecting = false;
    },
  },
});
</script>
