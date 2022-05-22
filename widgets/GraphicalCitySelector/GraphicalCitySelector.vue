<template>
  <GraphicalSelector label="استان / شهرستان / روستا" ref="selector" :data-list="data"/>
</template>
<script>
import {cities} from "@/custom/widgets/GraphicalCitySelector/cities";
import {provinces} from "@/custom/widgets/GraphicalCitySelector/provinces";
import {computed, onMounted, ref, toRef} from "vue";
import GraphicalSelector from "@/custom/widgets/GraphicalSelector";

export default {
  components: {GraphicalSelector},
  setup(props) {
    const selector = ref();
    onMounted(() => {
      selector.value.filter = (data, text) => data.name.search(text) > -1;
    })
    const data = computed(() => {
      return [].concat(cities).concat(provinces).sort((a,b) => a.name.length > b.name.length ? 1:-1);
    });
    return {
      selector,
      data,
    }
  }
}
</script>