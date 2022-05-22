<template>
  <td>
    <slot>
      {{ $props.data ? $props.data : "بدون داده" }}
    </slot>
  </td>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import TableTDMixin from "@/custom/mixins/TableTDMixin";

export default defineComponent({
  mixins: [TableTDMixin],
});
</script>