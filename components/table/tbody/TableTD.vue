<template>
  <td>
    <slot :computedValue="computedValue">
      {{ computedValue ? computedValue : "بدون داده" }}
    </slot>
  </td>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import TableTDMixin from "@/custom/mixins/TableTDMixin";

export default defineComponent({
  mixins: [TableTDMixin],
  props: ['data'],
  computed: {
    computedValue: function () {
      if (this.data) {
        if (this.data.value) {
          return this.data.value
        } else {
          return this.data;
        }
      }
      return null
    }
  }
});
</script>