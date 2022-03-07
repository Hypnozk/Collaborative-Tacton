<template>
    <BaseRow
      class="device-row"
      :class="{ hover: device[DEVICE_INFO.knownService] }"
      @click="
        connectToDevice(
          device[DEVICE_INFO.id],
          device[DEVICE_INFO.knownService]
        )
      "
    >
      <div class="device-icon">
        <BaseIcon v-if="device[DEVICE_INFO.name]" :icon="mdiCrosshairs" />
        <BaseIcon v-else :icon="mdiCrosshairsQuestion" />
      </div>
      <div class="separator" />
      <BaseColumn class="device-name">
        <BaseText>
          {{
            device[DEVICE_INFO.name]
              ? device[DEVICE_INFO.name]
              : "unknown device"
          }}
          <span v-if="device[DEVICE_INFO.state] == 'connected'">
            (connected)
          </span>
        </BaseText>
      </BaseColumn>
      <div class="separator" />
      <BaseColumn class="device-id">
        <BaseText>
          {{ device[DEVICE_INFO.id] }}
        </BaseText>
      </BaseColumn>
      <div class="separator" />
      <BaseColumn class="device-rssi">
        <BaseText>
          {{ device[DEVICE_INFO.rssi] }}
        </BaseText>
      </BaseColumn>
    </BaseRow>
</template>

<script>
import { mdiCrosshairsQuestion, mdiCrosshairs } from "@mdi/js";

export default {
  name: "DeviceComponent",
  props: {
    device: Object,
  },
  data() {
    return {
      mdiCrosshairs,
      mdiCrosshairsQuestion,
    };
  },
  methods: {
    connectToDevice(id, ok) {
      if (!ok) return;

      console.log(id);
     // sendToServer(WS_BT.connectDevice, id);
    },
  },
};
</script>

<style scoped lang="scss">
.device-row {
  height: 50px;
  min-height: 50px;
  min-width: 100%;
  border: 1px solid $dark-font-color-light;
  border-radius: 2px;
  @include align-items(center);

  &.hover {
    font-style: italic;
    @include standard-hover {
      background-color: $dark-font-color-light;
    }
  }

  .separator {
    height: 100%;
    border-right: 1px solid $dark-font-color-light;
  }

  .device-icon {
    @include align-self(center);
  }

  .device-name,
  .device-id,
  .device-rssi,
  .device-icon {
    margin: 0 10px;
  }

  .device-name {
    min-width: 200px;
  }

  .device-id {
    min-width: 150px;
  }
}
</style>
