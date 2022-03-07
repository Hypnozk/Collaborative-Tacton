<template>
  <span class="mdi-icon" role="img">
    <svg class="mdi-icon-svg" :width="size" :height="size" viewBox="0 0 24 24">
      <path :d="path"></path>
    </svg>
  </span>
</template>

<script>
export default {
  name: "BaseIcon",
  props: {
    size: {
      type: Number,
      default: 24,
    },
    path: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss">
.mdi-icon {
  @include inline-flex;
  @include align-self(center);
  @include relative();
  .mdi-icon-svg {
    fill: currentColor;
  }
}
</style>
