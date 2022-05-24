<template>
  <v-row no-gutters style="margin-bottom: 5px" id="tactonHeader">
    <v-btn @click="changeRecordMode"> Start Record </v-btn>
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
import { useStore } from "@/renderer/store/store";
import { TactonSettingsActionTypes } from "@/renderer/store/modules/tactonSettings/tactonSettings";

interface IntensityObject {
  intensity: number;
  index: number;
  object: PIXI.Graphics;
}
interface ChannelGraph {
  channelId: number;
  container: PIXI.Container;
  intensities: IntensityObject[];
}
export default defineComponent({
  name: "TactonScreen",
  data() {
    return {
      pixiApp: null as PIXI.Application | null,
      ticker: null as PIXI.Ticker | null,
      store: useStore(),
      width: 0,
      height: 0,
      paddingRL: 20,
      distLinesY: 0,
      channelGraphs: [] as ChannelGraph[],
      isRecording: false,
      maxDuration: 10000,
      growRatio: 0,
      currentTime: 0,
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
    this.width = document.getElementById("tactonScreen")!.clientWidth;
    console.log(this.width);
    this.height =
      document.getElementById("tactonScreen")!.clientHeight -
      document.getElementById("tactonHeader")!.clientHeight;
    this.pixiApp.renderer.resize(this.width, this.height);

    document.getElementById("tactonDisplay")!.appendChild(this.pixiApp.view);

    const numberOfOutputs = 12;
    let duration = this.maxDuration / 1000;

    const timeInterval = duration / 5;
    this.distLinesY = this.height / (numberOfOutputs + 1 + 1);
    const distLinesX = (this.width - 2 * this.paddingRL) / 5;
    this.growRatio = (this.width - 2 * this.paddingRL) / this.maxDuration;

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0x000000, 1);

    let yPosition = 0;
    for (let i = 0; i < numberOfOutputs + 1; i++) {
      yPosition += this.distLinesY;
      graphics.moveTo(this.paddingRL, yPosition);
      graphics.lineTo(this.width - this.paddingRL, yPosition);
    }

    let xPosition = this.width - this.paddingRL;
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

    this.ticker = PIXI.Ticker.shared;
    this.ticker.autoStart = false;
    this.ticker.stop();
    this.store.dispatch(TactonSettingsActionTypes.instantiateArray);
  },
  methods: {
    loop(delta: any) {
      //console.log("delt   as: " + delta);
      console.log("currentTime: " + this.currentTime);
      const startTime = Math.round(this.ticker!.elapsedMS);
      const additionalWidth = this.growRatio * startTime;
      const channels = this.store.state.tactonSettings.deviceChannel;

      for (let i = 0; i < channels.length; i++) {
        if (channels[i].intensity == 0) continue;
        const graph = this.channelGraphs.find(
          (graph) => graph.channelId == channels[i].id
        );

        if (graph == undefined) {
          console.log("channelds is undefined");
          //there is currently no rectangle
          const container = new PIXI.Container();
          const rect = new PIXI.Graphics();
          rect.beginFill(0xffff00);

          // set the line style to have a width of 5 and set the color to red
          rect.lineStyle(5, 0xff0000);
          /**
          console.log(
            "draw Rectangle at x: " +
              ((this.width - 2 * this.paddingRL) * this.currentTime) /
                (this.maxDuration * 1000) +
              " y: " +
              ((i + 1) * this.distLinesY - 20)
          );
           */
          // draw a rectangle
          const xPosition =
            ((this.width - 2 * this.paddingRL) * this.currentTime) /
              (this.maxDuration * 1000) +
            this.paddingRL;

          const yPosition = (i + 1) * this.distLinesY - 20;
          rect.drawRect(0, 0, additionalWidth, 40);

          //rect.pivot.set(0, 0);
          rect.position.set(xPosition, yPosition);

          container.addChild(rect);
          this.channelGraphs.push({
            channelId: channels[i].id,
            container: container,
            intensities: [
              {
                index: container.children.length - 1,
                intensity: channels[i].intensity,
                object: rect,
              },
            ],
          });

          this.pixiApp?.stage.addChild(container);
          ///this.ticker?.stop();
        } else {
          //console.log("channel is defined");
          if (
            graph.intensities[graph.intensities.length - 1].intensity ==
            channels[i].intensity
          ) {
            //intensities are still the same just draw rectangle wider
            //console.log("update graph");
            const index = graph.intensities.length - 1;
            /**
            console.log("rectangle.x", graph.intensities[index].object.x);
            console.log("rectangle.y", graph.intensities[index].object.y);
            console.log(
              "rectangle.position",
              graph.intensities[index].object.position
            );
            console.log(
              "rectangle.getBounds()",
              graph.intensities[index].object.getBounds()
            );
          
              console.log((additionalWidth / 2) + graph.intensities[index].object.x)
               graph.intensities[index].object.x =(additionalWidth / 2) + graph.intensities[index].object.x
            graph.intensities[index].object.width =
              graph.intensities[index].object.width + additionalWidth;
     */
console.log("rectangle.x", graph.intensities[index].object.x);
            const xPosition = graph.intensities[index].object.x;
            const yPosition = graph.intensities[index].object.y;
            const width = graph.intensities[index].object.width;

            const rect = new PIXI.Graphics();
            rect.beginFill(0xff0000);

            // set the line style to have a width of 5 and set the color to red
            rect.lineStyle(5, 0xff0000);
            rect.drawRect(0, 0, width + additionalWidth, 40);
                 rect.position.set(xPosition, yPosition);
            graph.container.removeChildAt(graph.intensities[index].index);
            graph.container.addChild(rect);
            graph.intensities[index] = {
              index: graph.container.children.length-1,
              intensity: graph.intensities[index].intensity,
              object: rect,
            };
          }
        }
      }

      this.currentTime += startTime;
      //this.ticker!.stop();
    },
    changeRecordMode() {
      this.isRecording = !this.isRecording;
      if (this.isRecording == true) {
        this.currentTime = 0;
        this.channelGraphs.forEach((graph) => {
          graph.container.removeChildren();
        });
        this.channelGraphs = [];
        this.ticker?.add(this.loop);
        this.ticker?.start();
      } else {
        this.ticker?.stop();
        this.ticker?.remove(this.loop);
      }
    },
    startChannelActivity() {
      console.log("startChannelActivity");
      this.store.dispatch(TactonSettingsActionTypes.modifySpecificChannel, {
        id: 5,
        intensity: 1,
      });
    },
    stopChannelActivity() {
      console.log("stopChannelActivity");
      const graph = this.channelGraphs.find((graph) => graph.channelId == 5);
      if (graph == undefined) {
        console.log("undefinded");
        return;
      }
      console.log(
        "width is: " +
          graph.intensities[graph.intensities.length - 1].object.width
      ); // =200;
      graph.intensities[graph.intensities.length - 1].object.scale.x = 0.5;
      console.log(
        "width is: " +
          graph.intensities[graph.intensities.length - 1].object.width
      ); // =200;
      this.store.dispatch(TactonSettingsActionTypes.modifySpecificChannel, {
        id: 5,
        intensity: 0,
      });
    },
  },
});
</script>