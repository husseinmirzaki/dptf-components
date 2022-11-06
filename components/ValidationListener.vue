<template>
  <div class="d-none"></div>
</template>

<script>
import { toRef, watch } from 'vue';

export default {
  props: ['data'],
  setup(props, context) {
    let lastPopulation = new Date();
    const data = toRef(props, 'data');
    watch(data, () => {
      context.emit('submit');
    });
  },
};
</script>
