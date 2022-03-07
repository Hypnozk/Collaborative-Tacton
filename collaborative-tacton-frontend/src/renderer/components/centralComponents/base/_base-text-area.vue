<template>
  <textarea
    v-bind="$attrs"
    class="textarea"
    :class="{ 'no-resize': noResize, invalid: invalid }"
    :value="value"
    @input="$emit('update', $event.target.value)"
  />
</template>

<script>
export default {
  name: "TextArea",
  model: {
    event: "update",
  },
  props: {
    value: { type: String, default: "" },
    noResize: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
  },
  emits: ["update"],
};
</script>

<style scoped lang="scss">
.textarea {
  @include size(100%, calc(2.25rem + 2px));
  @include border-radius(0.3rem);
  border: 1px solid black;
  background-color: $darker-base-color;
  color: $font-color;
  padding: 0.25rem 0.75rem 0.25rem 0.75rem;

  &.no-resize {
    resize: none;
  }

  &.invert-color {
    border: 1px solid $dark-base-color;
    background-color: $dark-base-color;

    &:focus {
      background-color: $darker-base-color;
    }
  }

  &:focus {
    outline: none;
    border: 1px solid #fd5f00;
  }
}
</style>
