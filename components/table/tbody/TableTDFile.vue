<template>
  <table-t-d style="direction: ltr;">
    <a download down v-if="link" :href="link">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.3" d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM13 15.4V10C13 9.4 12.6 9 12 9C11.4 9 11 9.4 11 10V15.4H8L11.3 18.7C11.7 19.1 12.3 19.1 12.7 18.7L16 15.4H13Z" fill="green"/>
<path d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z" fill="green"/>
</svg>

    </a>
    <div v-else>
      بدون فایل
    </div>
  </table-t-d>
</template>
<script lang="ts">
import {defineComponent, toRef} from "vue";
import TableTD from "@/custom/components/table/tbody/TableTD.vue";

export default defineComponent({
  components: {TableTD},
  props: ['data'],
  setup(props) {
    const link = toRef(props, 'data').value;

    return {
      link,
    }
  }
});
</script>