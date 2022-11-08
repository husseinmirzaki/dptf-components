<template>
  <td>
    <slot>
      {{ type }}
    </slot>
  </td>
</template>
<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import TableTDMixin from "@/custom/mixins/TableTDMixin";

export default defineComponent({
  props: ["data"],
  setup(props) {
    const data = toRef(props, "data");

    const type = computed(() => {
      switch (data.value) {
        case "0":
          return "داخلی";
        case "1":
          return "وارده";
        case "2":
          return "صادره";
        default:
          return "";
      }
    });
    return {
      type,
    };
  },
});
</script>
