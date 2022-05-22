<template>
  <table-t-d>
    <div
        class="cursor-pointer symbol symbol-40px"
        title="User profile">
      <img src="media/avatars/150-26.jpg" alt="metronic">
    </div>
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

    return {}
  }
});
</script>