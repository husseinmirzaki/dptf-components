<template>
  <div class="card-xl-stretch mb-xl-8 bg-white card">
    <div class="card-body p-2 flex-grow-0">
      <label for="province-search">{{ label }}</label>
      <input
        id="province-search"
        v-model="cityFilter"
        type="text"
        class="form-control"
      />
    </div>
    <div class="places">
      <span
        class="place"
        v-for="city in computedCityData.slice(0, 20)"
        :key="city.id"
        @click="toggleItem(city)"
        :class="{
          selected: selected.indexOf(city) > -1,
        }"
      >
        {{ city.name }}
      </span>
    </div>
  </div>
</template>
<style lang="scss">
.places {
  .place {
    padding: 5px 10px;
    margin: 5px;
    display: inline-block;
    background-color: #e5e5e8;
    color: #1e1e1e;
    border: 0.5px solid black;
    transition: all 350ms;

    &:hover {
      background-color: #a3a3a4;
      color: #101010;
    }

    &.selected {
      background-color: #1f2562;
      color: white;
    }
  }
}
</style>
<script>
import { cities } from '@/custom/widgets/GraphicalCitySelector/cities';
import { provinces } from '@/custom/widgets/GraphicalCitySelector/provinces';
import { computed, ref, toRef } from 'vue';

export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    search: {
      type: Function,
    },
    label: {
      type: String,
    },
  },
  setup(props, context) {
    const dataList = toRef(props, 'dataList');
    const cityFilter = ref('');
    const selected = ref([]);

    const toggleItem = (city) => {
      const index = selected.value.findIndex((element) => {
        return element.id === city.id && element.name == city.name;
      });
      if (index > -1) {
        selected.value.splice(index, 1);
      } else {
        selected.value.push(city);
      }
      context.emit('selected', selected.value);
    };

    const filter = (data, inputText) => {
      return data.name.search(inputText) > -1;
    };

    const computedCityData = computed(() => {
      if (cityFilter.value == '') {
        return [].concat(dataList.value).splice(0, 20);
      }
      return []
        .concat(dataList.value)
        .filter((element) => filter(element, cityFilter.value));
    });

    return {
      toggleItem,
      cityFilter,
      computedCityData,
      selected,
    };
  },
};
</script>
