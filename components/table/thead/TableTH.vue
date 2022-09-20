<template>
  <th>
    <div class="d-flex flex-row position-relative align-items-center justify-content-center">
      <div v-if="!disableFilters" class="managed-items-container position-absolute">
        <div class="icon"
             style="background-image: url(/media/icons/table/not-ordered.png); background-size: 17px 17px"></div>
        <div class="icon"
             @click="$emit('showFilter', header)"
             style="background-image: url(/media/icons/table/no-filter.png);background-size: 12px 12px"></div>
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
  display: none;
  position: absolute;
  top: 50%;
  left: -5px;
  transform: translateY(-70%);
  height: 15px;

  .icon {
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
    .managed-items-container {
      display: flex;
    }
  }
}
</style>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  components: {},
  props: ['header', 'disableFilters']
});
</script>