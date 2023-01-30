<template>
  <TableV1
      ref="refTable"
      :conf="conf"
      :url="url"
      :list="list"
  />
</template>
<script>
import TableV1 from "./table/TableV1";
import {onMounted, ref, watch} from "vue";

export default {
  emits: ['update:modelValue'],
  props: ['conf', 'url', 'name', 'list'],
  components: {TableV1},
  setup(props, context) {
    const refTable = ref();
    const setData = (e) => {
      Object.keys(refTable.value.checkedDataList).forEach((ee) => delete refTable.value.checkedDataList[ee]);
      if (Array.isArray(e)) {
        const toSet = {};
        e.forEach((e) => {
          toSet['check_' + e] = true;
        });
        Object.keys(toSet).forEach((ee) => refTable.value.checkedDataList[ee] = toSet[ee]);
      }
    }

    onMounted(() => {
      watch(refTable.value.checkedDataList, (e) => {
        const ids = Object.keys(e).filter((ee) => e[ee]).map((ee) => Number(ee.replace("check_", "")));
        context.emit("update:modelValue", ids);
      });
    });

    return {
      setData,
      refTable,
    }
  }
}
</script>