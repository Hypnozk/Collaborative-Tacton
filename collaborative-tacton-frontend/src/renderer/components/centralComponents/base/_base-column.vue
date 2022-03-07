<template>
  <div :class="{ column: !forceRow, row: forceRow, centered: centered }">
    <slot />
  </div>
</template>

<script>
export default {
  name: "BaseColumn",
  props: {
    centered: { type: Boolean, default: false },
    forceRow: { type: Boolean, default: false },
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
