<template>
  <table-t-d>
    <FieldComponent
        input_class="table-input-class"
        v-bind="$attrs"
    />
  </table-t-d>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import TableTD from "@/custom/components/table/tbody/TableTD.vue";
import FieldComponent from "@/custom/components/FieldComponent.vue";

export default defineComponent({
  components: {FieldComponent, TableTD},
  props: ['data'],
});
</script>
<style>
.table-input-class {
  padding: 2px 3px !important;
  border-radius: 0px !important;
}
</style>