<template>
  <div>
    <div class="main">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "Main",
};
</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
}
</style>
