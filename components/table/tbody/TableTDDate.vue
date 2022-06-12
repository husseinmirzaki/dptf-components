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
      let date = new Date();
      if (data.value) {
        let date_time = false
        if (data.value.split("-").length > 3) {
          date_time = true
        }
        date = new Date(data.value);
        const persian = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
        if (date_time){
          return `${persian[0]} / ${persian[1]} / ${persian[2]} ${date.getHours()}:${date.getMinutes()}`;
        }
        return `${persian[0]} / ${persian[1]} / ${persian[2]}`;
      }
      return '';
    });

    return {
      converted,
    }
  }
});
</script>