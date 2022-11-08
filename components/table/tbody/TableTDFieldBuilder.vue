<template>
  <table-t-d class="form-related-field-container">
    <FieldBuilder v-bind="$attrs" />
  </table-t-d>
</template>
<script>
import TableTD from "@/custom/components/table/tbody/TableTD";
import FieldBuilder from "@/custom/components/FieldBuilder";
export default {
  components: { FieldBuilder, TableTD },
};
</script>
<style scoped>
table td.form-related-field-container {
  padding-top: 2px !important;
  padding-bottom: 4px !important;
}
</style>
