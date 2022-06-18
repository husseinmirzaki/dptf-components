<template>
  <table-t-d style="direction: ltr;">
    {{ converted }}
  </table-t-d>
</template>
<script lang="ts">
import {computed, defineComponent, toRef} from "vue";
import TableTD from "@/custom/components/table/tbody/TableTD.vue";
import {gregorianToJalali} from "@/custom/components/DateUtils";

export default defineComponent({
  components: {TableTD},
  props: ['data'],
  setup(props) {
    const data = toRef(props, 'data');

    const converted = computed(() => {
      if (/\d+:\d+:\d+$/.test(data.value)) {
        return data.value;
      }
      let date = new Date();
      if (data.value) {
        date = new Date(data.value);
        const persian = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
        return `${persian[0]} / ${persian[1]} / ${persian[2]} ${date.getHours()}:${date.getMinutes()}`;
      }
      return '';
    });

    return {
      converted,
    }
  }
});
</script>