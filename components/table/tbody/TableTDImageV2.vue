<template>
  <td>
    <div class="d-flex align-items-center">
      <div
        class="symbol symbol-50px me-5"
        @click="$viewerApi({ images: [data] })"
      >
        <span class="symbol-label bg-light">
          <img :src="data" class="h-75 align-self-end" alt="" />
        </span>
      </div>
    </div>
  </td>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['data'],
});
</script>
