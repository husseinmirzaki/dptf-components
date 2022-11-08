<template>
  <div
    class="tab-pane fade"
    :class="{
      'active show': active,
    }"
    :id="tabId"
    role="tabpanel"
  >
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { randomId } from "@/custom/helpers/random";

export default defineComponent({
  props: {
    active: {
      default: false,
    },
    tabId: {
      type: String,
      default: () => {
        return `id-tab-${randomId(4)}`;
      },
    },
  },
});
</script>
