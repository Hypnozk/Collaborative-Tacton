<template>
  <input
    class="input"
    :class="{ 'invert-color': invertColor }"
    :type="type"
    :max="max"
    :min="min"
    :step="step"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  name: "BaseInput",
  // Change the v-model event name to `update` to avoid changing
  // the behavior of the native `input` event.
  model: {
    event: "update",
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    max: { type: String, default: undefined },
    min: { type: String, default: undefined },
    step: { type: String, default: undefined },
    type: {
      type: String,
      default: "text",
      // Only allow types that essentially just render text boxes.
      validator(value) {
        return [
          "email",
          "number",
          "password",
          "search",
          "tel",
          "text",
          "url",
          "range",
          "hidden",
        ].includes(value);
      },
    },
    invertColor: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
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

.input[type] {
  -moz-appearance: textfield;
  -webkit-appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>
