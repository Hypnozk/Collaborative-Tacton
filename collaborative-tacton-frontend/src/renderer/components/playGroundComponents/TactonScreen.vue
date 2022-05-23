<template>
  <v-row no-gutters style="margin-bottom: 5px" id="tactonHeader">
    <v-btn @click="startChannelActivity"> Start Try </v-btn>
    <v-btn @click="stopChannelActivity"> Stop Try </v-btn>
  </v-row>
  <div id="tactonDisplay"></div>
</template>

<style lang="scss" scoped>
.playGroundView {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 100% !important;
  max-width: 100% !important;
  background-color: aquamarine;
}
</style>

<script lang="ts">
import * as PIXI from "pixi.js";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "TactonScreen",
  data() {
    return {
      pixiApp: null as PIXI.Application | null,
      width: 0,
      height: 0,
    };
  },
  mounted() {
    console.log("mounted");
    this.pixiApp = new PIXI.Application({
      transparent: true,
      antialias: true,
    });
    //this.$el.appendChild(this.app.view);
    this.pixiApp.renderer.view.style.display = "block";
    const tactonScreen = document.getElementById("tactonDisplay")!;
    this.width = document.getElementById("tactonScreen")!.clientWidth;
    this.height =
      document.getElementById("tactonScreen")!.clientHeight -
      document.getElementById("tactonHeader")!.clientHeight;
    this.pixiApp.renderer.resize(this.width, this.height);

    document.getElementById("tactonDisplay")!.appendChild(this.pixiApp.view);

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0x000000, 1);
    const numberOfOutputs = 12;
    let duration = 10;

    const timeInterval = duration / 5;
    const paddingRL = 20;
    const distLinesY = this.height / (numberOfOutputs + 1 + 1);
    const distLinesX = (this.width - 2 * paddingRL) / 5;

    let yPosition = 0;
    for (let i = 0; i < numberOfOutputs + 1; i++) {
      yPosition += distLinesY;
      graphics.moveTo(paddingRL, yPosition);
      graphics.lineTo(this.width - paddingRL, yPosition);
    }

    let xPosition = this.width - paddingRL;
    for (let i = 0; i <= 5; i++) {
      graphics.moveTo(xPosition, yPosition - 10);
      graphics.lineTo(xPosition, yPosition + 10);
      const label = new PIXI.Text(duration.toString() + " s", {
        fontFamily: "Arial",
        fontSize: 12,
        align: "center",
      });
      let xOffset = 8;
      if (duration >= 10) xOffset = 12;

      label.x = xPosition - xOffset;
      label.y = yPosition + 15;
      this.pixiApp.stage.addChild(label);

      duration -= timeInterval;
      xPosition -= distLinesX;
    }

    this.pixiApp.stage.addChild(graphics);
  },
  methods: {
    startChannelActivity() {
      console.log("startChannelActivity");
    },
    stopChannelActivity() {
      console.log("startChannelActivity");
    },
  },
});
</script>