<template>
  <v-container fill-height class="container">
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col cols="6" style="paddingtop: 25px; paddingleft: 60px">Room</v-col>
        <v-col cols="6">
          <v-text-field hide-details="auto" v-model="roomName"></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col
          cols="6"
          style="paddingtop: 25px; paddingleft: 60px"
          v-model="userName"
          >Username</v-col
        >
        <v-col cols="6">
          <v-text-field hide-details="auto"></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" style="margintop: 40px">
        <v-btn elevation="2" color="primary" @click="enterRoom"
          >Enter Room</v-btn
        >
      </v-row>
       <v-row align="center" justify="center" style="margintop: 40px">
        <v-btn elevation="2" color="primary" @click="enter"
          >Enter</v-btn
        >
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "RoomView",
  data() {
    return {
      roomName: "",
      userName: "",
      clientWS: null as any
    };
  },
  methods: {
    enterRoom() {
      this.clientWS = new WebSocket("ws://localhost:8080/patth?token=secure");
      this.clientWS.addEventListener("error", function (event:any) {
        console.log("WebSocket error: ", event);
      });
      //clientWS.send("hello")
      console.log(this.roomName);
    },
    enter() {
      
      this.clientWS.send("hello")
      console.log(this.roomName);
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 50%;
  height: 100%;
  align-items: center;
  font-weight: bold;
  font-size: 1.5em;
}
</style>