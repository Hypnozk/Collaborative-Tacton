<template>
  <div class="direct-input-intensity">
    <BaseLabeledInput
      class="slider"
      :label="label"
      :model-value="value"
      :type="'range'"
      min="0"
      max="1"
      step="0.05"
      :variant="variant"
      @update="$emit('update', parseFloat($event))"
    />
    <BaseText class="info" :variant="variant">
      {{ Math.round(value * 100) }}%
    </BaseText>
  </div>
</template>

<script>
export default {
  name: "Intensity",
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "0",
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
.direct-input-intensity {
  display: grid;
  grid-template-columns: 90% 10%;
  gap: 1.5em;
  grid-template-areas: "slider info";
  width: 100%;
}
.slider {
  grid-area: slider;
  padding: 5;
}
.info {
  grid-area: info;
}
</style>
