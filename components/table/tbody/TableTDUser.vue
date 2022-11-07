<template>
  <table-t-d>
    <div class="cursor-pointer symbol symbol-40px">
      <img
        src="media/avatars/150-26.jpg"
        alt="metronic"
        @click="
          $viewerApi({
            images: ['media/avatars/150-26.jpg'],
          })
        "
      />
    </div>
  </table-t-d>
</template>
<script lang="ts">
import { defineComponent, toRef } from "vue";
import TableTD from "@/custom/components/table/tbody/TableTD.vue";

export default defineComponent({
  components: { TableTD },
  props: ["data"],
  setup(props) {
    const data = toRef(props, "data");

    return {};
  },
});
</script>
