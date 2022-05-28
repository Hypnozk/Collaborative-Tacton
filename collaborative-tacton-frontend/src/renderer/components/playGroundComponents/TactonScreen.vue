<template>
  <v-row
    no-gutters
    align="center"
    style="justify-content: space-evenly; margin: 5px 0"
    id="tactonHeader"
  >
    <v-col style="max-width: fit-content">
      <v-btn @click="changeRecordMode" color="primary"> Start Record </v-btn>
      <v-btn @click="startChannelActivity"> Start Try </v-btn>
      <v-btn @click="stopChannelActivity"> Stop Try </v-btn>
    </v-col>
    <v-col style="max-width: fit-content">
      <v-row align="center">
        Duration:
        <v-select
          class="durationBox"
          :items="items"
          v-model="duration"
        ></v-select>
      </v-row>
    </v-col>
  </v-row>
  <v-row no-gutters v-if="false">
    <v-btn @click="startChannelActivity"> Start Try </v-btn>
    <v-btn @click="stopChannelActivity"> Stop Try </v-btn>
  </v-row>
  <div id="tactonDisplay"></div>
</template>

<style lang="scss">
.durationBox {
  padding-left: 10px;
  max-width: 100px;
  .v-input__control {
    height: 40px !important;
    max-height: 40px !important;
    display: flex;
    .v-field {
      .v-label {
        display: none;
      }
      .v-field__append-inner {
        display: flex;
        height: 40px !important;
        align-items: center;
        padding-top: 0;
      }
      .v-field__field {
        height: 40px !important;
        max-height: 40px !important;
        display: flex;
        padding-top: 0;
      }
    }
  }
  .v-input__details {
    display: none;
  }
}
</style>
<script lang="ts">
import * as PIXI from "pixi.js";
import { CanvasRenderer } from "@pixi/canvas-renderer";
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "@/renderer/store/store";
import { TactonSettingsActionTypes } from "@/renderer/store/modules/tactonSettings/tactonSettings";

interface IntensityObject {
  intensity: number;
  index?: number;
  width?: number;
  object?: PIXI.Graphics;
}
interface GraphicObject {
  channelId: number;
  container: PIXI.Container;
}

interface ChannelGraph extends GraphicObject {
  intensities: IntensityObject[];
}
export default defineComponent({
  name: "TactonScreen",
  data() {
    return {
      pixiApp: null as PIXI.Application | null,
      graphContainer: null as PIXI.Container | null,
      channelGraphs: [] as ChannelGraph[],
      coordinateContainer: null as PIXI.Container | null,
      legendLabels: [] as GraphicObject[],
      maskIndex: -1,
      ticker: null as PIXI.Ticker | null,
      store: useStore(),
      width: {
        original: -1,
        actual: -1,
      },
      height: {
        original: -1,
        actual: -1,
      },
      paddingRL: 20,
      isRecording: false,
      maxDuration: 10000,
      growRatio: 0,
      currentTime: 0,
      numberOfOutputs: 12,
      dropdownDisabled: false,
      items: ["5s", "10s", "15s"],
    };
  },
  computed: {
    duration: {
      get(): string {
        return (this.maxDuration / 1000).toString() + "s";
      },
      set(newValue) {
        this.calcLegend();
        this.maxDuration =
          Number(newValue.substring(0, newValue.length - 1)) * 1000;
      },
    },
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

    this.numberOfOutputs = 12;
    /**
     * draw grid System
     */

    /**
     *
     */

    /**
     * create mask for graphs, so that they are cut off
     */

    document.getElementById("tactonDisplay")!.appendChild(this.pixiApp.view);

    /**
     * create ticker for animation
     */
    this.ticker = PIXI.Ticker.shared;
    this.ticker.autoStart = false;
    this.ticker.stop();
    this.store.dispatch(TactonSettingsActionTypes.instantiateArray);

    //this.resizeScreen();
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
      const newWidth = document.getElementById("tactonScreen")!.clientWidth;
      const newHight =
        window.innerHeight -
        document.getElementById("tactonHeader")!.clientHeight -
        document.getElementById("headerPlayGround")!.clientHeight;

      if (this.width.original == -1) {
        this.width.original = newWidth;
        this.width.actual = newWidth;
        this.growRatio =
          (this.width.original - 2 * this.paddingRL) / this.maxDuration;
        console.log(newWidth);

        this.height.original = newHight;
        this.height.actual = newHight;

        this.pixiApp!.stage.removeChildren
        this.coordinateContainer = new PIXI.Container();
        this.pixiApp!.stage.addChild(
          this.coordinateContainer! as PIXI.Container
        );
        const graphContainer = new PIXI.Container();
        this.pixiApp!.stage.addChild(graphContainer);
        this.graphContainer = graphContainer;
      }

      if (this.width.original !== -1 && this.height.original !== -1) {
        const xRatio = newWidth / this.width.actual;
        const yRatio = newHight / this.height.actual;
        this.width.actual = newWidth;
        this.height.actual = newHight;

        this.graphContainer!.width = this.graphContainer!.width * xRatio;
        this.graphContainer!.height = this.graphContainer!.height * yRatio;
        console.log(
          "x value " +
            this.graphContainer!.x +
            "   " +
            this.graphContainer!.width
        );
        console.log(
          "y value " +
            this.graphContainer!.y +
            "   " +
            this.graphContainer!.height
        );
        this.pixiApp?.renderer.resize(this.width.actual, this.height.actual);
        this.createMask();
        this.calcLegend();
      }
    },
    createMask() {
      if (this.maskIndex !== -1)
        this.pixiApp?.stage.removeChildAt(this.maskIndex);
      const px_mask_outter_bounds = new PIXI.Graphics();
      px_mask_outter_bounds.beginFill();
      px_mask_outter_bounds.drawRect(
        this.paddingRL,
        0,
        this.width.actual - 2 * this.paddingRL,
        this.height.actual
      );
      px_mask_outter_bounds.endFill();
      px_mask_outter_bounds.renderable = true;
      px_mask_outter_bounds.cacheAsBitmap = true;
      this.pixiApp!.stage.addChild(px_mask_outter_bounds);

      this.maskIndex = this.pixiApp!.stage.children.length - 1;
      this.graphContainer!.mask = px_mask_outter_bounds;
    },
    calcLegend() {
      console.log("dsd");
      this.coordinateContainer?.removeChildren();
      let xPosition = this.width.actual - this.paddingRL;
      let yPosition = 0;
      const distLinesY = this.height.actual / (this.numberOfOutputs + 1 + 1);
      const distLinesX = (this.width.actual - 2 * this.paddingRL) / 5;
      let duration = this.maxDuration / 1000;
      const timeInterval = duration / 5;

      const graphics = new PIXI.Graphics();
      graphics.lineStyle(1, 0x000000, 1);

      //draw horizontal lines
      for (let i = 0; i < this.numberOfOutputs + 1; i++) {
        yPosition += distLinesY;
        graphics.moveTo(this.paddingRL, yPosition);
        graphics.lineTo(this.width.actual - this.paddingRL, yPosition);
      }

      //draw vertical lines and labels
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
        this.coordinateContainer?.addChild(label);
        duration -= timeInterval;
        xPosition -= distLinesX;
      }

      this.coordinateContainer?.addChild(graphics);
    },
    drawRectangle(
      idGraph: number,
      additionalWidth: number,
      intensity: number,
      container: PIXI.Container,
      xPosition?: number,
      yPosition?: number
    ) {
      const height = 40 * intensity;
      const distLinesY = this.height.original / (this.numberOfOutputs + 1 + 1);
      if (xPosition == undefined)
        xPosition =
          ((this.width.original - 2 * this.paddingRL) * this.currentTime) /
            this.maxDuration +
          this.paddingRL;

      if (yPosition == undefined)
        yPosition = (idGraph + 1) * distLinesY - height * 0.5;

      console.log(
        "draw Rectangle at x: " +
          ((this.width.original - 2 * this.paddingRL) * this.currentTime) /
            this.maxDuration +
          this.paddingRL
      );

      // console.log( (idGraph + 1) * distLinesY - height * 0.5)
      // draw the rectangle
      const rect = new PIXI.Graphics();
      rect.beginFill(0xff0000);
      rect.lineStyle(5, 0xff0000);
      rect.drawRect(0, 0, additionalWidth, height);
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
          if (this.currentTime >= 10000) {
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
            graph.container.removeChildAt(lastIntensityObject.index!);

            const intensityObject = this.drawRectangle(
              i,
              lastIntensityObject.width! + additionalWidth,
              channels[i].intensity,
              graph.container as PIXI.Container,
              lastIntensityObject.object?.x,
              lastIntensityObject.object?.y
            );

            graph.intensities[index] = intensityObject;
          } else {
            //intensity changed, draw new rectangle
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
      this.store.dispatch(TactonSettingsActionTypes.modifySpecificChannel, {
        id: 11,
        intensity: 2,
      });
    },
    stopChannelActivity() {
      console.log("stopChannelActivity");
      this.store.dispatch(TactonSettingsActionTypes.modifySpecificChannel, {
        id: 5,
        intensity: 0,
      });
      this.store.dispatch(TactonSettingsActionTypes.modifySpecificChannel, {
        id: 11,
        intensity: 1,
      });
    },
  },
});
</script>