<template>

  <div class="d-flex tabs justify-content-between w-100">
    <group-buttons :buttons="tabs" :selectedB="selected" @selected="selectedTab=$event"/>
    <div>
      <button
          type="button"
          class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
          data-kt-menu-flip="top-end"
      >
      <span class="svg-icon svg-icon-2">
        <inline-svg src="media/icons/duotune/general/gen024.svg"/>
      </span>
      </button>
      <DropdownV2/>
    </div>
  </div>
  <div class="d-flex tab-content" v-if="tabs.length > 0">
    <slot :name="'tab_' + selectedTab.id"/>
  </div>
</template>
<script>
import {ref} from "vue";
import DropdownV2 from "@/custom/components/DropdownV2";
import GroupButtons from "@/custom/widgets/CustomTabs/GroupButtons";

export default {
  components: {GroupButtons, DropdownV2},
  data() {
    return {
      selectedTab: {},
    };
  },
  props: {
    tabs: {
      default: () => [],
    },
    selected: {
      default: () => {
        return {};
      },
    },
  },
  mounted() {
    this.selectedTab = this.selected;
  },
  watch: {
    selected: function() {
      this.selectedTab = this.selected;
    }
  }
}
</script>