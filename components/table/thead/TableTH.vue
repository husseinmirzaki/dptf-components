<template>
  <th>
    <div class="d-flex flex-row position-relative align-items-center justify-content-center">
      <div v-if="!disableFilters" class="managed-items-container position-absolute">
        <div class="icon"
             @click="$emit('toggleOrder')"
             style="background-image: url(/media/icons/table/not-ordered.png); background-size: 17px 17px"
             v-if="!sortDirection"/>
        <div class="icon d-block"
             @click="$emit('toggleOrder')"
             style="background-image: url(/media/icons/table/ascending.png); background-size: 17px 17px"
             v-if="sortDirection === 'asc'"/>
        <div class="icon d-block"
             @click="$emit('toggleOrder')"
             style="background-image: url(/media/icons/table/descending.png); background-size: 17px 17px"
             v-if="sortDirection === 'desc'"/>
        <div class="icon"
             v-if="isFiltered !== true"
             @click="$emit('showFilter', header)"
             style="background-image: url(/media/icons/table/no-filter.png);background-size: 12px 12px"></div>
        <div class="icon d-block"
             v-if="isFiltered === true"
             @click="$emit('showFilter', header)"
             style="background-image: url(/media/icons/table/has-filter.png);background-size: 12px 12px"></div>
      </div>

      <slot name="extra-part-0"/>
      <p class="p-0 m-0 text-hover-dark">{{ $props.header }}</p>
    </div>
    <!--    <field-component input_class="table-filter-smaller text-center" placeholder="فیلتر" :required="false" />-->
  </th>
</template>
<style>
th:hover .filter-place-holder {
  opacity: 1;
}
</style>
<style lang="scss">
.table-filter-smaller {
  font-size: 11px;
}

.managed-items-container {
  display: flex;
  position: absolute;
  top: 50%;
  left: -5px;
  transform: translateY(-70%);
  height: 15px;

  .icon {
    display: none;
    width: 20px;
    height: 20px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: background-color ease 200ms;
    border-radius: 5px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.19);
    }
  }
}

th {
  &:hover {
    .icon {
      display: block;
    }
  }
}
</style>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  components: {},
  props: ['header', 'disableFilters', 'isFiltered', 'sortDirection']
});
</script>