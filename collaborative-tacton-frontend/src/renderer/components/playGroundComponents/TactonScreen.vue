<template>
  <v-row
    no-gutters
    align="center"
    style="justify-content: space-evenly; margin: 5px 0"
    id="tactonHeader"
  >
    <v-col style="max-width: fit-content">
      <v-btn @click="changeRecordMode" color="primary">
        {{ store.state.roomSettings.isRecording ? "Stop" : "Start" }} Record
      </v-btn>
    </v-col>
    <v-col style="max-width: fit-content">
      <v-row align="center">
        Duration:
        <v-select
          class="durationBox"
          :items="items"
          v-model="duration"
          :disabled="isRecordingStore"
        ></v-select>
      </v-row>
    </v-col>
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
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "@/renderer/store/store";
import { TactonSettingsActionTypes } from "@/renderer/store/modules/tactonSettings/tactonSettings";
import { sendSocketMessage } from "@/renderer/CommunicationManager/WebSocketManager";
import { WS_MSG_TYPE } from "@/renderer/CommunicationManager/WebSocketManager/ws_types";

interface IntensityObject {
  intensity: number;
  startTime?: number;
  endTime?: number;
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
  props: {
    isMounted: {
      type: Boolean,
    },
  },
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
      growRatio: 0,
      currentTime: 0,
      dropdownDisabled: false,
      items: ["5s", "10s", "15s"],
    };
  },
  computed: {
    maxDurationStore(): number {
      return this.store.state.roomSettings.maxDuration;
    },
    duration: {
      get(): string {
        return (this.maxDurationStore / 1000).toString() + "s";
      },
      set(newValue: any) {
        sendSocketMessage(WS_MSG_TYPE.CHANGE_DURATION_SERV, {
          roomId: this.store.state.roomSettings.id,
          duration: newValue.substring(0, newValue.length - 1) * 1000,
        });
      },
    },
    newStoreItem(): boolean {
      return this.store.state.tactonSettings.insertValues;
    },
    isRecordingStore(): boolean {
      return this.store.state.roomSettings.isRecording;
    },
    numberOfOutputs(): number {
      return this.store.getters.getNumberOfOutputs;
    },
  },
  watch: {
    isMounted(newVal, oldVal) {
      if (newVal == true && newVal !== oldVal) this.resizeScreen();
    },
    maxDurationStore() {
      this.calcLegend();
      this.growRatio =
        (this.width.original - 2 * this.paddingRL) / this.maxDurationStore;
      this.resizeRectangles();
    },
    isRecordingStore(recordMode) {
      //update store from server, response retrieved
      if (recordMode) {
        this.currentTime = 0;
        this.channelGraphs.forEach((graph) => {
          graph.container.removeChildren();
        });
        this.channelGraphs = [];
        if (this.ticker !== null && this.ticker.count > 0)
          this.ticker?.remove(this.loop);
        this.ticker?.add(this.loop);
      } else {
        this.ticker?.stop();
        this.ticker?.remove(this.loop);
      }
    },
    newStoreItem(newValue) {
      console.log("newStoreItem " + newValue);
      if (this.newStoreItem == true) {
        if (this.store.state.roomSettings.isRecording == true)
          this.ticker?.start();
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.resizeScreen);

    this.pixiApp = new PIXI.Application({
      transparent: true,
      antialias: true,
      resolution: window.devicePixelRatio,
    });
    this.pixiApp.renderer.view.style.display = "block";
    document.getElementById("tactonDisplay")?.appendChild(this.pixiApp.view);

    /**
     * create ticker for animation
     */
    this.ticker = PIXI.Ticker.shared;
    this.ticker.autoStart = false;
    this.ticker.stop();
    this.store.dispatch(TactonSettingsActionTypes.instantiateArray);

    if (this.isMounted) this.resizeScreen();
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

        console.log(newWidth);

        this.height.original = newHight;
        this.height.actual = newHight;

        this.pixiApp!.stage.removeChildren;
        this.coordinateContainer = new PIXI.Container();
        this.pixiApp!.stage.addChild(
          this.coordinateContainer! as PIXI.Container
        );
        const graphContainer = new PIXI.Container();
        this.pixiApp!.stage.addChild(graphContainer);
        this.graphContainer = graphContainer;
      }

      const xRatio = newWidth / this.width.actual;
      const yRatio = newHight / this.height.actual;
      this.width.actual = newWidth;
      this.height.actual = newHight;

      this.graphContainer!.width = this.graphContainer!.width * xRatio;
      this.graphContainer!.height = this.graphContainer!.height * yRatio;
      /**        console.log(
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
         */

      this.pixiApp?.renderer.resize(this.width.actual, this.height.actual);
      this.createMask();
      this.growRatio =
        (this.width.original - 2 * this.paddingRL) / this.maxDurationStore;
      this.calcLegend();
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
      this.coordinateContainer?.removeChildren();
      let xPosition = this.width.actual - this.paddingRL;
      let yPosition = 0;
      const distLinesY = this.height.actual / (this.numberOfOutputs + 1 + 1);
      const distLinesX = (this.width.actual - 2 * this.paddingRL) / 5;
      let duration = this.maxDurationStore / 1000;
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
    resizeRectangles() {
      const channels = this.store.state.tactonSettings.deviceChannel;
      for (let i = 0; i < channels.length; i++) {
        const graph = this.channelGraphs.find(
          (graph) => graph.channelId == channels[i].channelId
        );

        if (graph == undefined) continue;
        const intensityArray: IntensityObject[] = [];
        graph.container.removeChildren();
        let timeToMoveContainer = 0;
        if (this.currentTime > this.maxDurationStore)
          timeToMoveContainer = this.currentTime - this.maxDurationStore;

        graph.container.x = 0 - timeToMoveContainer * this.growRatio;
        for (let z = graph.intensities.length - 1; z >= 0; z--) {
          if (graph.intensities[z].intensity == 0) continue;
          let lastDrawTime = -1;
          if (this.currentTime > 15000) lastDrawTime = this.currentTime - 15000;

          if (graph.intensities[z].endTime! < lastDrawTime) break;
          intensityArray.push({
            intensity: graph.intensities[z].intensity,
            startTime: graph.intensities[z].startTime,
            endTime: graph.intensities[z].endTime,
          });
        }

        graph.intensities = [];
        for (let z = intensityArray.length - 1; z >= 0; z--) {
          const duration =
            intensityArray[z].endTime! - intensityArray[z].startTime!;
          const intensityObject = this.drawRectangle(
            graph.channelId,
            intensityArray[z].startTime! * this.growRatio + this.paddingRL,
            duration * this.growRatio,
            intensityArray[z].intensity,
            graph.container as PIXI.Container
          );

          graph.intensities.push({
            ...intensityObject,
            startTime: intensityArray[z].startTime,
            endTime: intensityArray[z].endTime,
          });
        }
      }
    },
    drawRectangle(
      idGraph: number,
      xPosition: number,
      additionalWidth: number,
      intensity: number,
      container: PIXI.Container
    ) {
      if (intensity == 0) return { intensity: 0 };
      const distLinesY = this.height.original / (this.numberOfOutputs + 1 + 1);
      const height = (distLinesY - 25) * intensity;
      let yPosition = (idGraph + 1) * distLinesY - height * 0.5;

      //console.log("draw Rectangle at x: " + xPosition);
      // console.log(draw Rectangle at x: " + yPosition)
      //console.log("draw Rectangle width: " + additionalWidth);
      //console.log("draw Rectangle height: " + height);
      // draw the rectangle
      const rect = new PIXI.Graphics();
      rect.beginFill(0x5353c6);
      rect.lineStyle(5, 0x5353c6);
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
    loop() {
      const additionalWidth = this.growRatio * this.ticker!.elapsedMS;
      const channels = this.store.state.tactonSettings.deviceChannel;
      /**      console.log(
        "startTime: " +
          this.currentTime +
          " additionalWidth: " +
          additionalWidth
      );
       */

      for (let i = 0; i < channels.length; i++) {
        const graph = this.channelGraphs.find(
          (graph) => graph.channelId == channels[i].channelId
        );
        if (graph == undefined) {
          //if (channels[i].intensity == 0) continue;
          //there is currently no rectangle
          const container = new PIXI.Container();

          let xPosition = this.width.original - this.paddingRL;
          if (this.currentTime < this.maxDurationStore)
            xPosition =
              (xPosition * this.currentTime) / this.maxDurationStore +
              this.paddingRL;

          const intensityObject = this.drawRectangle(
            i,
            xPosition,
            additionalWidth,
            channels[i].intensity,
            container
          );
          this.channelGraphs.push({
            channelId: channels[i].channelId,
            container: container,
            intensities: [
              {
                ...intensityObject,
                startTime: this.currentTime,
                endTime: this.currentTime + this.ticker!.elapsedMS,
              },
            ],
          });

          this.graphContainer?.addChild(container);
          ///this.ticker?.stop();
        } else {
          //push the container to left, to have more place for new values
          if (this.currentTime >= this.maxDurationStore) {
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
              lastIntensityObject.object!.x,
              lastIntensityObject.width! + additionalWidth,
              channels[i].intensity,
              graph.container as PIXI.Container
            );

            graph.intensities[index] = {
              ...intensityObject,
              startTime: lastIntensityObject.startTime,
              endTime: lastIntensityObject.endTime! + this.ticker!.elapsedMS,
            };
          } else {
            //intensity changed, draw new rectangle
            const xPosition =
              ((this.width.original - 2 * this.paddingRL) * this.currentTime) /
                this.maxDurationStore +
              this.paddingRL;
            const intensityObject = this.drawRectangle(
              i,
              xPosition,
              additionalWidth,
              channels[i].intensity,
              graph.container as PIXI.Container
            );

            graph.intensities.push({
              ...intensityObject,
              startTime: this.currentTime,
              endTime: this.currentTime + this.ticker!.elapsedMS,
            });
          }
        }
      }

      this.currentTime += this.ticker!.elapsedMS;
      //this.ticker!.stop();
    },
    changeRecordMode() {
      if (this.store.state.roomSettings.isRecording) {
        sendSocketMessage(WS_MSG_TYPE.UPDATE_RECORD_MODE_SERV, {
          roomId: this.store.state.roomSettings.id,
          shouldRecord: false,
        });
      } else {
        sendSocketMessage(WS_MSG_TYPE.UPDATE_RECORD_MODE_SERV, {
          roomId: this.store.state.roomSettings.id,
          shouldRecord: true,
        });
      }
    },
  },
});
</script>