<template>
  <div :id="tabContainerId" class="tab-content">
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { randomId } from '@/custom/helpers/random';

export default defineComponent({
  props: {
    tabContainerId: {
      type: String,
      default: () => {
        return `id-tab-container-${randomId(3)}`;
      },
    },
  },
});
</script>
