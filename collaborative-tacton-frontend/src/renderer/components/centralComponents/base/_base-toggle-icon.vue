<template>
  <div
    class="toggle-icon"
    :class="{ on: value, off: !value, 'high-contrast': highContrast }"
    :style="{ height: iconSize + 'px' }"
    @click="$emit('update', !value)"
  >
    <BaseIcon v-if="value" :path="mdiToggleSwitch" :size="iconSize" title="" />
    <BaseIcon v-else :path="mdiToggleSwitchOff" :size="iconSize" title="" />
  </div>
</template>

<script>
import { mdiToggleSwitch } from "@mdi/js";
import { mdiToggleSwitchOff } from "@mdi/js";
export default {
  name: "BaseToggleIcon",
  inheritAttrs: false,
  model: {
    event: "update",
  },
  props: {
    value: { type: Boolean, default: true },
    iconSize: { type: Number, default: 28 },
    highContrast: { type: Boolean, default: false },
  },
  emits: ["update"],
  setup() {
    return { mdiToggleSwitch, mdiToggleSwitchOff };
  },
};
</script>

<style scoped lang="scss">
.toggle-icon {
  @include flexbox;
  @include align-items(center);
  @include justify-content(center);
  // @include square(30px);
  @include standard-hover;
  @include align-self(center);

  &.on {
    color: $accent-darker;
    &.high-contrast {
      color: $font-color;
    }
  }

  &.off {
    color: $font-color-darker;
    &.high-contrast {
      color: $dark-font-color;
    }
  }
}
</style>
