<template>
  <table-t-d style="direction: ltr;">
    {{ converted }}
  </table-t-d>
</template>
<script lang="ts">
import {computed, defineComponent, toRef} from "vue";
import TableTD from "@/custom/components/table/tbody/TableTD.vue";
import {gregorianIOSToPersianDate, gregorianToJalali} from "@/custom/components/DateUtils";

export default defineComponent({
  components: {TableTD},
  props: ['data'],
  setup(props) {
    const data = toRef(props, 'data');

    const converted = computed(() => {
      if (/\d+:\d+:\d+$/.test(data.value)) {
        return data.value;
      }
      if (data.value) {
        return gregorianIOSToPersianDate(data.value, true)
      }
      return '';
    });

    return {
      converted,
    }
  }
});
</script>