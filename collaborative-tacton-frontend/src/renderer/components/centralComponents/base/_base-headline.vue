<template>
  <component :is="'h' + type" :class="[size, variant]">
    <slot />
  </component>
</template>

<script>
export default {
  name: "BaseHeadline",
  props: {
    size: {
      type: String,
      default: "",
      validator(value) {
        return ["", "bigger", "big", "smaller", "small"].includes(value);
      },
    },
    type: {
      type: Number,
      default: 1,
      validator(value) {
        return parseInt(value) <= 6;
      },
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

<style scoped lang="scss">
$headings: h1 h2 h3 h4 h5 h6;

$font-size-upper: 2.8;
$font-size-dec: 0.3;

@each $heading in $headings {
  #{$heading} {
    @include font-size($font-size-upper);

    &.bigger {
      @include font-size($font-size-upper + 0.05);
    }
    &.big {
      @include font-size($font-size-upper + 0.1);
    }
    &.smaller {
      @include font-size($font-size-upper - 0.05);
    }
    &.small {
      @include font-size($font-size-upper - 0.1);
    }
  }
  $font-size-upper: $font-size-upper - $font-size-dec;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  @include color-classes;
}
</style>
