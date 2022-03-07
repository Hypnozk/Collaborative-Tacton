<template>
  <p :class="variant">
    <slot />
  </p>
</template>

<script>
export default {
  name: "BaseText",
  props: {
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

<style scoped lang="scss">
p {
  @include color-classes;
  margin: auto;
}
</style>
