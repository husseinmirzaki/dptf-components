<template>
  <td>
    <slot>
      {{ $props.data ? $props.data : '123456' }}
    </slot>
  </td>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import TableTDMixin from '@/custom/mixins/TableTDMixin';

export default defineComponent({
  mixins: [TableTDMixin],
});
</script>
