<template>
  <v-card
    class="mx-auto pa-1 keyButton"
    max-width="200"
    min-height="100"
    @click="keyButtonClicked"
  >
    <v-card-text style="padding: 1px" class="keyButton">
      <v-row no-gutters>
        name
        <v-spacer />
        <div>20%</div>
      </v-row>
      <v-row no-gutters class="cardMainRow">
        <div>Key</div>
      </v-row>
    </v-card-text>
    <v-card-actions style="padding: 2px; min-height: 0">
      <v-row align="center" justify="end" no-gutters>
        <v-icon class="mr-1" small @click.stop @click="edit">
          mdi-pencil
        </v-icon>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
.keyButton {
  display: flex;
  flex-direction: column;
}

.cardMainRow {
  flex-grow: 1;
  margin: 0;
  justify-content: center;
  align-items: center;
}
</style>

<script lang="ts">
import { useStore } from "@/renderer/store/store";
import { defineComponent } from "@vue/runtime-core";
import { KeyBoardButton } from "@/types/GeneralType";
export default defineComponent({
  name: "KeyBoardButton",
  data() {
    return {
      enabled: true,
    };
  },
  props: {
    button: {
      type: Object as () => KeyBoardButton,
      required: true,
    },
    isMoved: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["updateIsMoved"],
  methods: {
    keyButtonClicked() {
      if (this.isMoved) {
        ("the item get just moved");
        this.$emit("updateIsMoved", false);
      } else {
        console.log("keyButtonClicked");
      }
    },
    edit(message: any, events: any) {
      //events.prevent()
      console.log("edit my face");
    },
  },
});
</script>