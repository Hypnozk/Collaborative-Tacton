<!--inital view initiate the router and the toast for user messages -->
<template>
  <div tabindex="0" class="main" @keyup="buttonUp" @keydown="buttonDown">
    <div class="root">
      <v-app>
        <v-main>
          <router-view />
          <transition name="fade">
            <div class="snackbar" v-show="!store.getters.isConnectedToSocket">
              <div class="label">
                It seems you are offline pleasy try to reconnect
              </div>
              <v-btn
                text
                color="transparent"
                @click="reconnectSocket"
                loading="isReconnecting"
              >
                <v-progress-circular
                  v-if="isReconnecting"
                  indeterminate
                  color="red"
                  :size="20"
                ></v-progress-circular>
                <v-icon v-else left> mdi-reload </v-icon>
                <div class="customIcon">Retry</div>
              </v-btn>
            </div>
          </transition>
          <transition name="fade">
            <div
              class="snackbarSucess"
              style="background-color: rgb(218, 141, 27)"
              v-show="
                store.getters.isConnectedToSocket &&
                store.state.generalSettings.tactonLengthZero
              "
            >
              <div class="label">
                You have to record one tacton, before you could save it.
              </div>
            </div>
          </transition>

          <transition name="fade">
            <div
              class="snackbarSucess"
              style="background-color: rgb(49, 146, 62)"
              v-show="
                store.getters.isConnectedToSocket &&
                (store.state.generalSettings.userNameChanged ||
                  store.state.generalSettings.copiedToClipboard)
              "
            >
              <div class="label">
                {{
                  store.state.generalSettings.copiedToClipboard
                    ? "Copied adress to clipboard"
                    : "Username get succesfully updated."
                }}
              </div>
            </div>
          </transition>
        </v-main>
      </v-app>
    </div>
  </div>
</template>

<style lang="scss">
.main {
  height: 100%;
  outline: none;
  justify-content: center;
  display: flex;
}

.v-main__wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.root {
  display: block;
  width: 100%;
}
.customIcon {
  padding-left: 5px;
}
.snackbar {
  display: flex;
  justify-content: space-between;
  width: 90%; /* Set a default minimum width */
  box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
  border-radius: 5px !important;
  // box-shadow: #333;
  background-color: #333; /* Black background color */
  color: #fff; /* White text color */
  text-align: center; /* Centered text */
  border-radius: 2px; /* Rounded borders */
  padding: 16px; /* Padding */
  margin: 16px; /* Padding */
  position: fixed; /* Sit on top of the screen */
  z-index: 1; /* Add a z-index if needed */
  bottom: 30px; /* 30px from the bottom */
}

.snackbarSucess {
  display: flex;
  justify-content: center;
  width: 50%; /* Set a default minimum width */
  box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important;
  border-radius: 5px !important;
  // box-shadow: #333;
  color: #fff; /* White text color */
  text-align: center; /* Centered text */
  border-radius: 2px; /* Rounded borders */
  padding: 16px; /* Padding */
  margin: auto; /* Padding */
  position: fixed; /* Sit on top of the screen */
  z-index: 1; /* Add a z-index if needed */
  bottom: 30px; /* 30px from the bottom */
}

.label {
  display: flex;
  align-items: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.9s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { RouterNames } from "../types/Routernames";
import { GeneralSettingsActionTypes } from "./store/modules/generalSettings/generalSettings";
import { useStore } from "./store/store";
import { initWebsocket } from "./CommunicationManager/WebSocketManager";
import { PlayGroundActionTypes } from "./store/modules/playGround/types";
export default defineComponent({
  name: "App",
  data() {
    return {
      store: useStore(),
      isReconnecting: false,
    };
  },
  watch: {
    $route(to) {
      //this.show = false;
      this.store.dispatch(
        GeneralSettingsActionTypes.changeCurrentView,
        to.name
      );
    },
  },
  methods: {
    reconnectSocket() {
      this.isReconnecting = true;
      initWebsocket(this.store);
      setTimeout(() => (this.isReconnecting = false), 5000);
    },
    correctFrameForInput(): boolean {
      return this.store.getters.currentView == RouterNames.PLAY_GROUND;
    },
    buttonDown(e: any) {
      if (this.store.state.playGround.inEditMode) return;
      if (!this.correctFrameForInput()) return;
      const key: string = e.key.toUpperCase();
      //console.log("buttonDown");
      this.store.dispatch(PlayGroundActionTypes.activateKey, {
        buttonKey: key,
        keyboard: true,
      });
    },
    buttonUp(e: any) {
      if (this.store.state.playGround.inEditMode) return;
      if (!this.correctFrameForInput()) return;
      const key = e.key.toUpperCase();
      //console.log("buttonUp");
      this.store.dispatch(PlayGroundActionTypes.deactivateKey, {
        buttonKey: key,
        keyboard: false,
      });
    },
  },
});
</script>
