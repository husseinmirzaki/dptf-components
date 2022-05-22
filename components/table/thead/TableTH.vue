<template>
  <th>
    <p class="p-0 m-0 text-hover-dark" >{{ $props.header }}</p>
<!--    <field-component input_class="table-filter-smaller text-center" placeholder="فیلتر" :required="false" />-->
  </th>
</template>
<style lang="scss">
.table-filter-smaller {
  font-size: 11px;
}
</style>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  components: {},
  props: ['header']
});
</script>