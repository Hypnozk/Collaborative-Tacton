<template>
  <div>
    <input
      class="input"
      :class="{ 'invert-color': invertColor }"
      type="range"
      :max="max"
      :min="min"
      :step="step"
      v-model="valueSlider"
    />
    <BaseText class="info" :variant="variant">
      {{ Math.round(valueSlider * 100) }}%
    </BaseText>
  </div>
</template>

<script>
export default {
  name: "BaseSlider",
  emits: ["update:sliderValue"],
  // Change the v-model event name to `update` to avoid changing
  // the behavior of the native `input` event.
  data() {
    return { valueSlider: 1 };
  },
  props: {
    max: { type: String, default: undefined },
    min: { type: String, default: undefined },
    step: { type: String, default: undefined },
    invertColor: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: "",
      validator(value) {
        return ["", "darker", "light", "dark"].includes(value);
      },
    },
  },
  watch: {
    valueSlider(newValue) {
      this.$emit("update:sliderValue", newValue);
    },
  },
};
</script>

<style scoped lang="scss">
.input {
  @include size(100%, calc(2.25rem + 2px));
  @include border-radius(0.3rem);
  border: 1px solid black;
  background-color: $darker-base-color;
  color: $font-color;
  padding: 0 1rem 0 1rem;

  &.invert-color {
    border: 1px solid $dark-base-color;
    background-color: $dark-base-color;

    &:focus {
      background-color: $darker-base-color;
    }
  }

  &:focus {
    outline: none;
    border: 1px solid $accent;
  }

  &[type="range"] {
    padding: 0;
  }
}

.input {
  -moz-appearance: textfield;
  -webkit-appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
