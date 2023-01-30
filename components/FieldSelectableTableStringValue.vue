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
  emits: ['update:modelValue', 'rowSelected'],
  props: ['conf', 'url', 'name', 'list', 'onPopulate', 'onCheckFromServer'],
  components: {TableV1},
  setup(props, context) {
    const refTable = ref();
    const setData = (e) => {
      e = JSON.parse(e);
      e.forEach((f) => {
        refTable.value.checkedDataList['check_' + f.id] = true;
        if (props.onCheckFromServer) {
          props.onCheckFromServer(refTable.value, f);
        }
      });
      // Object.keys(refTable.value.checkedDataList).forEach((ee) => delete refTable.value.checkedDataList[ee]);
      // if (Array.isArray(e)) {
      //   const toSet = {};
      //   e.forEach((e) => {
      //     toSet['check_' + e] = true;
      //   });
      //   Object.keys(toSet).forEach((ee) => refTable.value.checkedDataList[ee] = toSet[ee]);
      // }
    }
    const populateResults = async () => {
      const checkItems = refTable.value.checkedDataList;
      let ids = Object.keys(checkItems).filter((ee) => checkItems[ee]).map((ee) => ee.replace("check_", ""));
      if (props.onPopulate) {
        ids = await props.onPopulate(refTable.value, ids);
      }
      context.emit("update:modelValue", ids);
    }
    onMounted(() => {
      watch(refTable.value.checkedDataList, (e) => {
        populateResults();
      });
    });

    return {
      setData,
      refTable,
    }
  }
}
</script>