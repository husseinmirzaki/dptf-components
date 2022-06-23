<template>

  <div class="d-flex tabs w-100">
    <div class="d-flex flex-row w-100 justify-content-between the-tabs-container">
      <div class="d-flex flex-row">
        <slot name="before-group-button"/>
        <group-buttons :buttons="tabs" :selectedB="selected" @selected="$emit('changed', $event);selectedTab=$event"/>
      </div>
      <div class="d-flex">
        <slot name="after-group-button"/>
      </div>
    </div>
    <div v-if="showTooltip">
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
<style lang="scss">
.tab-content {
  background-color: #ffffff;
  padding: 0 5px 5px;
  box-shadow: 0 0 1px rgb(0 0 0 / 13%), 0 1px 3px rgb(0 0 0 / 20%);
  border-radius: 5px;
}
</style>
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
    showTooltip: {
      default: false,
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
    selected: function () {
      this.selectedTab = this.selected;
    }
  }
}
</script>