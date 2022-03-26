<template>
  <div class="containerNameButton">
    <label class="label">
      <BaseText :variant="variant">{{ label }}</BaseText>
    </label>
    <BaseInput
      class="input"
      :type="type"
      :max="max"
      :min="min"
      :step="step"
      :model-value="modelValue"
      :invert-color="invertColor"
      @update:modelValue="$emit('update', $event)"
    />
  </div>
</template>

<script>
export default {
  name: "BaseLabeledInput",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    label: { type: String, default: "" },
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
    variant: {
      type: String,
      default: "",
      validator(value) {
        return ["", "darker", "light", "dark"].includes(value);
      },
    },
  },
  emits: ["update"],
};
</script>

<style lang="scss" scoped>
.containerNameButton {
  display: grid;
  grid-template-columns: 30% 70%;
  gap: 0.7em 0.7em;
  height: 100%;
  padding: 10px;
  vertical-align: middle;
}
.input{
  margin-left: 10px;
}
</style>
