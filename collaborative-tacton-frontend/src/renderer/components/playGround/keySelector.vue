<template>
  <div class="container" @keydown="keydown">
    <label class="label">
      <BaseText :variant="'dark'">Key</BaseText>
    </label>
    <div class="selected">{{ selectedKey }}</div>
    <BaseButton class="button" @click="toggleSelectionActive">
      {{ selectionActive ? "Please enter Key now" : "Click to enter key" }}
    </BaseButton>
    <BaseText v-show="showWarning" class="warning">
      This key is already taken!
    </BaseText>
  </div>
</template>

<script>
import { useStore } from "@/renderer/store/store";

export default {
  name: "KeySelector",
  props: {
    selectedKey: {
      type: String,
      default: "",
    },
  },
  emits: ["selectKey"],
  data() {
    return {
      store: useStore(),
      selectionActive: false,
      showWarning: false,
    };
  },
  methods: {
    keydown(event) {
      const key = event.key.toUpperCase();
      if (this.selectionActive && !this.store.getters.keyAlreadyTaken(key)) {
        this.$emit("selectKey", key);
        this.selectionActive = false;
        this.showWarning = false;
      } else if (this.store.getters.keyAlreadyTaken(key)) this.showWarning = true;
    },
    toggleSelectionActive() {
      this.selectionActive = !this.selectionActive;
      if (!this.selectionActive) this.showWarning = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: 30% 20% 47%;
  gap: 0.7em 0.7em;
  grid-template-areas:
    "label selected button"
    "warning warning warning";
  height: 100%;
  padding: 10px;
  width: 100%;
  vertical-align: middle;
}
.label {
  grid-area: label;
}
.selected {
  grid-area: selected;
}
.button {
  grid-area: button;
}
.warning {
  color: red;
  grid-area: warning;
}
</style>
