<template>
  <div :class="{ row: !forceColumn, column: forceColumn, centered: centered }">
    <slot />
  </div>
</template>

<script>
export default {
  name: "BaseRow",
  props: {
    forceColumn: { type: Boolean, default: false },
    centered: { type: Boolean, default: false },
  },
};
</script>

<style scoped lang="scss">
.row {
  @include flexbox;
  @include flex-direction;
}

.column {
  @include flexbox;
  @include flex-direction(column);
}

.centered {
  @include justify-content(center);
  @include align-items(center);
}
</style>
