<template>
  <th>
    <div class="position-relative float-start" style="height: 20px;width:20px;">
      <slot name="extra-part-0"/>
    </div>
    <p class="p-0 m-0 text-hover-dark">{{ $props.header }}</p>
    <!--    <field-component input_class="table-filter-smaller text-center" placeholder="فیلتر" :required="false" />-->
  </th>
</template>
<style>
th:hover .filter-place-holder {
  opacity: 1;
}
</style>
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