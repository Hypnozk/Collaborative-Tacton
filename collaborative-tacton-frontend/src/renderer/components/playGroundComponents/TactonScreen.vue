<template>
  <v-row no-gutters style="margin-bottom: 5px" id="tactonHeader">
    <v-btn @click="changeRecordMode"> Start Record </v-btn>
    <v-btn @click="startChannelActivity"> Start Try </v-btn>
    <v-btn @click="stopChannelActivity"> Stop Try </v-btn>
  </v-row>
  <div id="tactonDisplay"></div>
</template>

<script lang="ts">
import * as PIXI from "pixi.js";
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "@/renderer/store/store";
import { TactonSettingsActionTypes } from "@/renderer/store/modules/tactonSettings/tactonSettings";

interface IntensityObject {
  intensity: number;
  index?: number;
  width?: number;
  object?: PIXI.Graphics;
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
      graphContainer: null as PIXI.Container | null,
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
      numberOfOutputs: 12,
    };
  },
  mounted() {
    console.log("mounted TactonScdren");
    window.addEventListener("resize", this.resizeScreen);

    this.pixiApp = new PIXI.Application({
      transparent: true,
      antialias: true,
      resolution: window.devicePixelRatio,
    });
    //pixiApp.autoResize=true
    //this.$el.appendChild(this.app.view);
    this.pixiApp.renderer.view.style.display = "block";
    this.width = document.getElementById("tactonScreen")!.clientWidth;
    this.height =
      document.getElementById("tactonScreen")!.clientHeight -
      document.getElementById("tactonHeader")!.clientHeight;
    this.pixiApp.renderer.resize(this.width, this.height);

    this.numberOfOutputs = 12;
    let duration = this.maxDuration / 1000;
    const timeInterval = duration / 5;
    this.distLinesY = this.height / (this.numberOfOutputs + 1 + 1);
    const distLinesX = (this.width - 2 * this.paddingRL) / 5;
    this.growRatio = (this.width - 2 * this.paddingRL) / this.maxDuration;

    /**
     * draw grid System
     */
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0x000000, 1);

    let yPosition = 0;
    for (let i = 0; i < this.numberOfOutputs + 1; i++) {
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

    /**
     * create mask for graphs, so that they are cut off
     */
    const graphContainer = new PIXI.Container();
    const px_mask_outter_bounds = new PIXI.Graphics();

    px_mask_outter_bounds.drawRect(
      this.paddingRL,
      0,
      this.width - 2 * this.paddingRL,
      this.height
    );
    // px_mask_outter_bounds.renderable = true;
    // px_mask_outter_bounds.cacheAsBitmap = true;
    this.pixiApp?.stage.addChild(px_mask_outter_bounds);
    graphContainer.mask = px_mask_outter_bounds;
    this.pixiApp?.stage.addChild(graphContainer);
    this.graphContainer = graphContainer;

    document.getElementById("tactonDisplay")!.appendChild(this.pixiApp.view);

    /**
     * create ticker for animation
     */
    this.ticker = PIXI.Ticker.shared;
    this.ticker.autoStart = false;
    this.ticker.stop();
    this.store.dispatch(TactonSettingsActionTypes.instantiateArray);
  },
  beforeUnmount() {
    if (this.ticker !== null && this.ticker.count > 0)
      this.ticker?.remove(this.loop);

    window.removeEventListener("resize", this.resizeScreen);
  },
  methods: {
    resizeScreen() {
      /**
       * be aware that changing the width will apply a scaling factor in the background
       * this means you have never to update the width or height for your calculation 
       * you will calculate the original position, width still and the scaling will position it relative  
       */
      this.pixiApp!.renderer.view.style.width =
        document.getElementById("tactonScreen")!.clientWidth + "px";
      this.pixiApp!.renderer.view.style.height =
        window.innerHeight -
        document.getElementById("tactonHeader")!.clientHeight -
        document.getElementById("headerPlayGround")!.clientHeight +
        "px";
    },
    drawRectangle(
      idGraph: number,
      additionalWidth: number,
      intensity: number,
      container: PIXI.Container
    ) {
      const xPosition =
        ((this.width - 2 * this.paddingRL) * this.currentTime) /
          this.maxDuration +
        this.paddingRL;
      const yPosition = (idGraph + 1) * this.distLinesY - 20;
      /**
          console.log(
            "draw Rectangle at x: " +
                ((this.width - 2 * this.paddingRL) * this.currentTime) /
          (this.maxDuration) + this.paddingRL);
      */

      // draw the rectangle
      const rect = new PIXI.Graphics();
      rect.beginFill(0xffff00);
      rect.lineStyle(5, 0xff0000);
      rect.drawRect(0, 0, additionalWidth, 40);
      rect.position.set(xPosition, yPosition);

      container.addChild(rect);
      //this.ticker?.stop();
      return {
        index: container.children.length - 1,
        intensity: intensity,
        width: additionalWidth,
        object: rect,
      };
    },
    loop(delta: any) {
      //console.log("startTime: " + delta);
      const additionalWidth = this.growRatio * this.ticker!.elapsedMS;
      const channels = this.store.state.tactonSettings.deviceChannel;
      console.log(
        "currentTisme: " +
          this.currentTime +
          " additionalWidth: " +
          additionalWidth
      );

      for (let i = 0; i < channels.length; i++) {
        const graph = this.channelGraphs.find(
          (graph) => graph.channelId == channels[i].id
        );
        if (graph == undefined) {
          if (channels[i].intensity == 0) continue;
          console.log("channel is undefined");
          //there is currently no rectangle
          const container = new PIXI.Container();
          const intensityObject = this.drawRectangle(
            i,
            additionalWidth,
            channels[i].intensity,
            container
          );
          this.channelGraphs.push({
            channelId: channels[i].id,
            container: container,
            intensities: [intensityObject],
          });

          this.graphContainer?.addChild(container);
          ///this.ticker?.stop();
        } else {
          console.log("channel is defined");
          //push the container to left, to have more place for new values
          if (this.currentTime > 10000) {
            graph.container.x -= additionalWidth;
          }
          //general item
          const index = graph.intensities.length - 1;
          const lastIntensityObject = graph.intensities[index];

          if (channels[i].intensity == 0) {
            if (lastIntensityObject.intensity !== 0) {
              graph.intensities.push({ intensity: 0 });
            }
            continue;
          }

          if (lastIntensityObject.intensity == channels[i].intensity) {
            //delete old rectangle and draw a new at same position with more width
            const xPosition = lastIntensityObject.object?.x;
            const yPosition = lastIntensityObject.object?.y;
            const width = lastIntensityObject.width! + additionalWidth;

            const rect = new PIXI.Graphics();
            rect.beginFill(0xff0000);
            rect.lineStyle(5, 0xff0000);
            rect.drawRect(0, 0, width, 40);
            rect.position.set(xPosition, yPosition);

            graph.container.removeChildAt(lastIntensityObject.index!);
            graph.container.addChild(rect);
            graph.intensities[index] = {
              index: graph.container.children.length - 1,
              intensity: lastIntensityObject.intensity,
              width: width,
              object: rect,
            };
          } else {
            //intensity changed, draw new rectangle
            //calculate properties of rectangle
            const intensityObject = this.drawRectangle(
              i,
              additionalWidth,
              channels[i].intensity,
              graph.container as PIXI.Container
            );

            graph.intensities.push(intensityObject);
          }
        }
      }

      this.currentTime += this.ticker!.elapsedMS;
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
        console.log(this.ticker?.count);
        if (this.ticker !== null && this.ticker.count > 0)
          this.ticker?.remove(this.loop);
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
      this.store.dispatch(TactonSettingsActionTypes.modifySpecificChannel, {
        id: 5,
        intensity: 0,
      });
    },
  },
});
</script>