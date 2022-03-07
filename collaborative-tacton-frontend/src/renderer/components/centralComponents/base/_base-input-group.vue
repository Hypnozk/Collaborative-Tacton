<template>
  <div class="input-group">
    <slot />
  </div>
</template>

<script>
export default {
  name: "BaseInputGroup",
};
</script>

<style scoped lang="scss">
.input-group {
  padding: 8px 0 8px 0;
}
</style>
