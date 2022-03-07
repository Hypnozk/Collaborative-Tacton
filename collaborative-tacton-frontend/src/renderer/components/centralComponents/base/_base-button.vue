<template>
  <button class="button" :class="{ 'icon-button': iconButton }">
    <slot />
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    iconButton: { type: Boolean, default: false },
  },
};
</script>

<style scoped lang="scss">
.button {
  @include flexbox;
  @include justify-content(center);
  @include align-items(center);
  color: $font-color;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  background-color: $accent;
  border-radius: 5px;

  &:hover {
    color: $font-color;
    @include gradient(rgba($accent, 0.5), rgba($accent, 0.2), vertical);
  }

  &:focus {
    @include custom-box-shadow(0, 0, 4px, 0, $accent-darker);
    outline: none;
  }

  &.disabled {
    @include gradient(rgba($accent, 0.6), rgba($accent-darker, 0.6), vertical);
    color: $dark-font-color-light;
  }

  &.icon-button {
    .material-design-icon {
      padding-left: 0;
    }
  }
}
</style>
