<template>
  <table-t-d style="direction: ltr">
    <span v-for="(item, i) in data" :key="i" :class="`badge badge-${item.color} mx-1`">{{ item.title }}</span>
  </table-t-d>
</template>
<script lang="ts">
import { defineComponent, toRef } from "vue";
import TableTD from "@/custom/components/table/tbody/TableTD.vue";
import { VueInstanceService } from "@/Defaults";

export default defineComponent({
  components: { TableTD },
  props: ["data"],
  setup() {
    return {
      VueInstanceService,
    };
  },
});
</script>
