<template>
  <FieldComponent
      v-if="showSelectAll"
      field_type="checkbox"
      v-model="considerAll"
      :placeholder="selectAllText"
  />
  <FieldComponent
      v-for="item in listOfData" :key="item.id"
      field_type="checkbox"
      v-model="selectedData[`item_` + item.id]"
      :placeholder="item.name"
  />
</template>
<script>
import FieldComponent from "@/custom/components/FieldComponent";
import {ref, watch} from "vue";

export function listMultiSelectIdExtractor(data, onlyTrue) {
  if (data && data.length > 0) {
    if (data[0]) {
      return 'all';
    } else {
      const idList = [];
      Object.keys(data[1]).forEach((key) => {
        if (data[1][key] || !onlyTrue) {
          idList.push(key.split('_')[1]);
        }
      })
      return idList.join(',');
    }
  }
  return '';
}

export default {
  components: {FieldComponent},
  props: {
    listOfData: {
      default: () => [],
    },
    showSelectAll: {
      default: true,
    },
    selectAllText: {
      default: 'همه',
    },
  },
  setup(props, context) {
    const considerAll = ref(true);
    const selectedData = ref({});

    watch(selectedData, (e) => {
      let allFalse = true;
      const keys = Object.keys(e);
      for (let i = 0; i < keys.length; i++) {
        if (selectedData.value[keys[i]]) {
          considerAll.value = false;
          console.log("all not false");
          allFalse = false;
          break;
        }
      }
      if (allFalse) {
        console.log("all false");
        considerAll.value = true;
      }
      context.emit('change', [considerAll.value, selectedData.value]);
    }, {
      deep: true,
    })
    watch(considerAll, (e) => {
      if (e) {
        const keys = Object.keys(selectedData.value);
        for (let i = 0; i < keys.length; i++) {
          selectedData.value[keys[i]] = false;
        }
      }
      context.emit('change', [considerAll.value, selectedData.value]);
    })
    return {
      considerAll,
      selectedData,
    }
  }
}
</script>