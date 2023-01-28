<template>
  <th class="table-fields-container">
    <div class="d-flex align-items-center justity-content-center">
      <div class="filter-mode px-2" @click="toggleMode(false)" @contextmenu.prevent="toggleMode(true)">
        <template v-for="compMode in compModes" :key="compMode">
          <inline-svg v-if="mode == compMode[0]" :src="compMode[2]" width="20" height="20" :title="compMode[1]" />
        </template>
      </div>
      <slot />
    </div>
  </th>
</template>
<script lang="ts">
import { VueInstanceService } from '@/Defaults';
import { Ref, onMounted, defineComponent, ref } from 'vue';
const BOOLEAN_COMP_SELECTS = [
  [1, "بلی", "media/icons/light/equals.svg"],
  [0, "خیر", "media/icons/light/not-equal.svg"],
];

const FOREIGN_COMP_SELECTS = [
  [1, "مساوی", "media/icons/light/equals.svg"],
  [2, "بجز", "media/icons/light/not-equal.svg"],
];

const STRING_COMP_SELECTS = [
  [1, "مساوی", "media/icons/light/equals.svg"],
  [2, "بجر", "media/icons/light/not-equal.svg"],
  [3, "شامل", "media/icons/light/intersection.svg"],
  [4, "شروع شود", "media/icons/light/left-to-line.svg"],
  [5, "تمام شود", "media/icons/light/right-to-line.svg"],
];

const DATE_COMP_SELECTS = [
  [1, "مساوی"], "media/icons/light/equals.svg",
  [2, "بجر", "media/icons/light/not-equal.svg"],
  [3, "بزرگتر", "media/icons/light/greater-than.svg"],
  [4, "بزرگتر مساوی", "media/icons/light/greater-than-equal.svg"],
  [5, "کوچکتر", "media/icons/light/less-than.svg"],
  [6, "کوچکتر مساوی", "media/icons/light/less-than-equal.svg"],
];

const INTEGER_COMP_SELECTS = [
  [1, "مساوی", "media/icons/light/equals.svg"],
  [2, "بجر", "media/icons/light/not-equal.svg"],
  [3, "بزرگتر", "media/icons/light/greater-than.svg"],
  [4, "بزرگتر مساوی", "media/icons/light/greater-than-equal.svg"],
  [5, "کوچکتر", "media/icons/light/less-than.svg"],
  [6, "کوچکتر مساوی", "media/icons/light/less-than-equal.svg"],
];


export default defineComponent({
  props: ['fieldInstance'],
  setup(props, context) {
    const mode = ref(1);
    const compModes: Ref<Array<any>> = ref([]);

    const getBiggestItem = () => {
      let max = 0;
      compModes.value.forEach((e) => {
        if (e[0] > max) {
          max = e[0];
        }
      }); 
      return max;
    }
    
    const toggleMode = (backWards = false)=> {
      if (~compModes.value.findIndex((e) => e[0] == (backWards ? mode.value - 1 : mode.value + 1))) {
        mode.value = backWards ? mode.value - 1 : mode.value + 1;
      } else {
        mode.value = backWards ? getBiggestItem() : 1;
      }
      VueInstanceService.emit(`${props.fieldInstance.name}-comp`, mode.value);
    }
    onMounted(() => {
      const fieldType = props.fieldInstance.field_type;
      compModes.value = (() => {
        if (!fieldType || fieldType == "text") return STRING_COMP_SELECTS;
        else if (fieldType == "integer" || fieldType == "number")
          return INTEGER_COMP_SELECTS;
        else if (fieldType == "p-date-time") return DATE_COMP_SELECTS;
        else if (fieldType == "checkbox") return BOOLEAN_COMP_SELECTS;
        return FOREIGN_COMP_SELECTS;
      })() as any;
    });
    return {
      toggleMode,
      compModes,
      mode
    }
  }
});
</script>
<style>

</style>