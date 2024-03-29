<template>
  <v-container class="playDialog" @keydown="enterNewKey" tabindex="-1">
    <v-row justify="center">
      <v-col cols="2" align-self="center" style="margin-top: 10px">
        Name
      </v-col>
      <v-col cols="7">
        <v-text-field
          variant="underlined"
          hide-details="auto"
          v-model="name"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" style="margin-bottom: 10px">
      <v-col cols="2" align-self="center"> Key </v-col>
      <v-col cols="7">
        <v-row no-gutters>
          <v-col cols="7" align-self="center">
            <div>
              {{ key }}
            </div>
            <div class="errorField" v-if="keyIsTaken">
              The Key is already taken.
            </div>
            <div class="errorField" v-if="!keyIsTaken && keyIsRequired">
              You have to enter a key.
            </div>
          </v-col>
          <v-col cols="5" style="display: flex; justify-content: flex-end">
            <v-btn elevation="2" color="primary" @click="startKeyDetection">
              <v-progress-circular
                v-if="isKeyDetecting"
                indeterminate
                color="red"
                :size="20"
              ></v-progress-circular>
              <div style="padding: 5px">Detect</div>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="2" align-self="center"> Intensity </v-col>
      <v-col cols="7">
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
      <v-col cols="7">
        <v-row style="justify-content: space-between" no-gutters>
          <v-col cols="1" v-for="(item, index) in colors" v-bind:key="index">
            <span
              class="dot"
              :style="[
                item == colorButtons
                  ? { backgroundColor: item, border: 'solid 0.11em' }
                  : { backgroundColor: item },
              ]"
              @click="colorButtons = item"
            ></span>
          </v-col>
        </v-row>
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
      <v-btn elevation="2" color="primary" @click="$emit('closeDialog')">
        Cancel
      </v-btn>
      <v-spacer />
      <v-btn
        elevation="2"
        color="primary"
        style="margin-right: 20px"
        v-if="keyButtonId !== undefined"
        @click="deleteButton"
      >
        Delete
      </v-btn>
      <v-btn elevation="2" color="primary" @click="modifyButton">
        Confirm
      </v-btn>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.playDialog {
  background-color: white;
  min-width: 90%;
  align-items: center;
  border-radius: 20px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.playDialog:focus {
  outline: none;
}

.dot {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
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
import {
  PlayGroundActionTypes,
  PlayGroundMutations,
} from "@/renderer/store/modules/playGround/types";
import { useStore } from "@/renderer/store/store";
import { RouterNames } from "@/types/Routernames";
import { defineComponent } from "@vue/runtime-core";
import { lightenDarkenColor, defaultColors } from "../../lib/colors";

export default defineComponent({
  name: "PlayGroundDialog",
  emits: ["closeDialog"],
  props: {
    keyButtonId: {
      type: String,
    },
  },
  data() {
    return {
      store: useStore(),
      isKeyDetecting: false,
      keyIsTaken: false,
      keyIsRequired: false,
      name: "",
      key: "",
      intensity: 1,
      colorButtons: defaultColors[1],
      channelActive: new Array(0).fill(false),
      colors: defaultColors,
    };
  },
  mounted() {
    //console.log("this.keyButtonId: " +this.keyButtonId);
    this.store.commit(
      GeneralMutations.CHANGE_VISIBILE_VIEW,
      RouterNames.PLAY_GROUND_DIALOG
    );

    /**
      set the number of maximum activeChannels
    */
    this.channelActive = new Array(this.store.getters.getNumberOfOutputs).fill(
      false
    );

    /**
    set channels active, if the area button get modified
    */
    if (this.keyButtonId == undefined) return;
    const keyButtonStore = this.store.getters.getKeyButton(this.keyButtonId);
    if (keyButtonStore == undefined) return;

    //insert values in dialog of found button
    if (keyButtonStore.name !== undefined) this.name = keyButtonStore.name;
    this.key = keyButtonStore.key;
    this.intensity = keyButtonStore.intensity;
    this.colorButtons = keyButtonStore.color;
    keyButtonStore.channels.forEach((element) => {
      this.channelActive[element] = true;
    });
  },
  computed: {
    colorActuator() {
      return (index: number) => {
        if (this.channelActive[index])
          return lightenDarkenColor(this.colorButtons, -100);
        return this.colorButtons;
      };
    },
  },
  methods: {
    updateChannel(currentState: boolean, index: number) {
      this.channelActive[index] = !currentState;
    },
    stopKeyDetection() {
      //stop the key detection ;
      this.isKeyDetecting = false;
    },
    startKeyDetection() {
      if (this.isKeyDetecting) return;
      this.isKeyDetecting = true;
      setTimeout(this.stopKeyDetection, 5000);
    },
    enterNewKey(e: any) {
      //check if user want to enter key
      if (!this.isKeyDetecting) return;

      const newKey = e.key.toUpperCase();
      this.keyIsRequired = false;

      this.key = newKey;
      //key is already taken
      if (this.store.getters.isKeyAlreadyTaken(this.keyButtonId, newKey)) {
        this.keyIsTaken = true;
        return;
      }

      //key is not taken
      this.keyIsTaken = false;
      this.isKeyDetecting = false;
      this.stopKeyDetection();
    },
    deleteButton() {
      if (this.keyButtonId == undefined) return;
      this.store.commit(
        PlayGroundMutations.DELETE_ITEM_FROM_GRID,
        this.keyButtonId
      );
      this.$emit("closeDialog");
    },
    modifyButton() {
      if (this.key.length == 0) {
        this.keyIsRequired = true;
        return;
      }

      if (this.keyIsTaken) return;

      const channels: number[] = [];
      this.channelActive.forEach((isActive, index) => {
        if (isActive) channels.push(index);
      });
      const button = {
        channels: channels,
        color: this.colorButtons,
        intensity: this.intensity,
        name: this.name,
        key: this.key,
        isActive: {
          mouse: false,
          keyboard: false,
        },
      };

      if (this.keyButtonId == undefined) {
        this.store.dispatch(PlayGroundActionTypes.addButtonToGrid, button);
        this.$emit("closeDialog");
      } else {
        this.store.dispatch(PlayGroundActionTypes.updateKeyButton, {
          id: this.keyButtonId,
          props: button,
        });
        this.$emit("closeDialog");
      }
    },
  },
});
</script>
