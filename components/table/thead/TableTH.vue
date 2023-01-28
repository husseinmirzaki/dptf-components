<template>
  <th class="custom-table-th" @click="$emit('toggleOrder')">
    <div
      class="custom-table-th-second d-flex flex-row position-relative align-items-center justify-content-center"
    >
      <div
        v-if="!disableFilters"
        class="managed-items-container position-absolute"
        :class="{
          'd-none': !sortDirection && !isFiltered,
          'd-flex': !sortDirection || !isFiltered,
        }"
      >
        <div
          class="icon"
          @click.stop="$emit('toggleOrder')"
          style="
            background-image: url(/media/icons/table/not-ordered.png);
            background-size: 17px 17px;
          "
          v-if="!sortDirection"
        />
        <div
          class="icon d-block"
          @click.stop="$emit('toggleOrder')"
          style="
            background-image: url(/media/icons/table/ascending.png);
            background-size: 17px 17px;
          "
          v-if="sortDirection === 'asc'"
        />
        <div
          class="icon d-block"
          @click.stop="$emit('toggleOrder')"
          style="
            background-image: url(/media/icons/table/descending.png);
            background-size: 17px 17px;
          "
          v-if="sortDirection === 'desc'"
        />
        <div
          class="icon"
          v-if="isFiltered !== true && !$attrs['disableFiltered']"
          @click.stop="$emit('showFilter', header)"
          style="background-image: url(/media/icons/table/no-filter.png);background-size: 12px 12px;"
        ></div>
        <div
          class="icon d-block"
          v-if="isFiltered === true && !$attrs['disableFiltered']"
          @click.stop="$emit('showFilter', header)"
          style="background-image: url(/media/icons/table/has-filter.png);background-size: 12px 12px;"
        ></div>
      </div>
      <slot name="extra-part-0" />
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
$p_height: 40px;
.table-filter-smaller {
  font-size: 11px;
}

.managed-items-container {
  position: absolute;
  top: 0;
  left: 0;
  height: $p_height;
  //background-color: rgba(0, 0, 0, 0.19);
  align-items: center;
  justify-content: center;

  .icon {
    display: block;
    width: 20px;
    height: 20px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: background-color ease 200ms;
    border-radius: 5px;
  }
}

th {
  &:hover {
    .managed-items-container {
      display: flex !important;
    }
  }
}

th.custom-table-th {
  &.pe-2 {
    padding: 0 5px 0 0 !important;
    vertical-align: middle;
  }
  padding: 0 5px 0 0 !important;

  height: $p_height !important;
  align-items: start;
  p {
    font-size: 15px;
    font-weight: 500 !important;
  }

  &:hover {
    background: #e3e2e2;
  }

  .custom-table-th-second {
    white-space: nowrap;
    height: $p_height !important;
  }
}
</style>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  props: ["header", "disableFilters", "isFiltered", "sortDirection"],
});
</script>
