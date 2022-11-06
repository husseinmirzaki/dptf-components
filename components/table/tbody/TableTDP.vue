<template>
  <td>
    {{ $props.text }}
  </td>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['text'],
});
</script>
