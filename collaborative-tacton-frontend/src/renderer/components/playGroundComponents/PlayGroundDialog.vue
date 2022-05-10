<template>
  <v-container class="playDialog">
    <v-row>
      <v-col cols="6"> Name dsde </v-col>
      <v-col cols="6">
        <v-text-field hide-details="auto" v-model="name"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col> Key </v-col>
      <v-col>
        <v-text-field hide-details="auto" v-model="key"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col> Intensity </v-col>
      <v-col>
        <v-text-field hide-details="auto" v-model="key"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col> Color </v-col>
      <v-col class="noAlpha">
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
  font-weight: bold;
  border-radius: 20px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
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
</style>

<script lang="ts">
import { useStore } from "@/renderer/store/store";
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
      name: "",
      key: "",
      intensity: 1,
      color: "#FF0000",
      channelActive: new Array(12).fill(false),
    };
  },
  mounted() {
    console.log("this.keyButtonId");
    console.log(this.keyButtonId);
    if (this.keyButtonId == undefined) return;
    const keyButton = this.store.getters.getKeyButton(this.keyButtonId);
    if (keyButton == undefined) return;
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
  },
});
</script>
