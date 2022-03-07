<template>
  <Layout>
    <BaseColumn centered>
      <BaseIcon :path="mdiEmoticonDead" class="not-found-icon" :size="80" />
      <BaseHeadline :type="1" class="not-found"> not found </BaseHeadline>
    </BaseColumn>
  </Layout>
</template>

<script>
import { mdiEmoticonDead } from "@mdi/js";
import Layout from "../layouts/main.vue";

export default {
  name: "404",
  page: {
    title: "404",
    meta: [{ name: "description", content: "404" }],
  },
  components: {
    Layout,
  },
  setup() {
    return { mdiEmoticonDead };
  },
};
</script>

<style scoped lang="scss">
.not-found-icon {
  margin-top: 4rem;
  color: $font-color-darker;
}
.not-found {
  color: $font-color-darker;
  @include font-size(3);
}
</style>
