<template>
  <div class="direct-input-intensity">
    <BaseText :variant="variant">{{ label }}</BaseText>

    <BaseSlider
      class="slider"
      min="0"
      max="1"
      step="0.05"
      :variant="variant"
      @update:sliderValue="$emit('update', parseFloat($event))"
    />
  </div>
</template>

<script>
export default {
  name: "Intensity",
  emits: ["update"],
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
};
</script>

<style lang="scss" scoped>
.direct-input-intensity {
  display: grid;
  grid-template-columns: 30% 70%;
  gap: 0.7em 0.7em;
  height: 100%;
  padding: 10px;
  vertical-align: middle;
}
.slider {
  display: grid;
  grid-template-columns: 85% 15%;
  gap: 0.7em;
  padding: 10px;
  vertical-align: middle;
}
</style>
