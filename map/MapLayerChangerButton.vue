<template>
  <LControl>
    <button
      class="btn btn-warning btn-sm"
      @click="$emit('update:modelValue', !modelValue)"
    >
      {{ !modelValue ? 'خطی' : 'ماهواره' }}
    </button>
  </LControl>
</template>

<script lang="ts">
import { LControl } from '@vue-leaflet/vue-leaflet';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { LControl },
  props: ['modelValue'],
});
</script>
