<template>
  <ul class="nav">
    <li class="nav-item" v-for="item in items" :key="item">
      <a
        @click.prevent="selected(item)"
        class="nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bolder px-4 me-1"
        :class="{ active: selectedItem === item }"
        >{{ item }}</a
      >
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: ['items'],
  setup(props, context) {
    const selectedItem = ref();
    const selected = (e) => {
      if (selectedItem.value == e) {
        selectedItem.value = null;
      } else {
        selectedItem.value = e;
      }
      context.emit('selected', selectedItem.value);
    };
    return {
      selected,
      selectedItem,
    };
  },
});
</script>
