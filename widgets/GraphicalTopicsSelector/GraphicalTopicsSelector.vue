<template>
  <GraphicalSelector
    label="موضوع"
    ref="selector"
    :data-list="data"
    @selected="$emit('selected', $event)"
  />
</template>
<script>
import { cities } from "@/custom/widgets/GraphicalCitySelector/cities";
import { provinces } from "@/custom/widgets/GraphicalCitySelector/provinces";
import { computed, onMounted, ref, toRef } from "vue";
import GraphicalSelector from "@/custom/widgets/GraphicalSelector";

export default {
  components: { GraphicalSelector },
  setup(props) {
    const selector = ref();
    onMounted(() => {
      selector.value.filter = (data, text) => data.name.search(text) > -1;
    });
    const data = computed(() => {
      return [
        {
          id: 1,
          name: "مسکن",
        },
        {
          id: 2,
          name: "اشتغال",
        },
        {
          id: 3,
          name: "بیمه و درمان",
        },
        {
          id: 4,
          name: "پوشش سازمان های حمایتی",
        },
        {
          id: 5,
          name: "آموزشی",
        },
        {
          id: 6,
          name: "معنوی",
        },
      ].sort((a, b) => (a.name.length > b.name.length ? 1 : -1));
    });
    return {
      selector,
      data,
    };
  },
};
</script>
