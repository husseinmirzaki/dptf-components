<template>
  <div
    class="custom-tabs-container d-flex"
    :class="{
      'flex-column': !horizontal,
    }"
  >
    <div
      class="custom-tab"
      :class="{
        tabs: tabs,
        horizontal: horizontal,
        active: button === selectedButton,
      }"
      v-for="button in buttons"
      :key="button.id"
      @click="
        selectedButton = button;
        $emit('selected', button);
      "
    >
      {{ button.name }}
    </div>
  </div>
</template>
<style lang="scss">
.custom-tabs-container {
  margin-bottom: 5px;
  background-color: #bebebe;
  border-radius: 5px;

  .custom-tab:last-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .custom-tab:first-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}

.custom-tab {
  margin: 0 0 0 0;
  cursor: default;
  position: relative;
  font-size: 16px;
  padding: 14px 7px;
  &.active {
    background-color: #fff;
    color: #0b0e18;
    overflow: hidden;
    &:after {
      position: absolute;
      content: '';
      width: 100%;
      height: 3px;
      background-color: #0b0e18;
      top: 0;
      left: 0;
    }
  }
}
</style>
<script>
export default {
  data() {
    return {
      selectedButton: {},
    };
  },
  props: {
    tabs: {
      default: false,
    },
    horizontal: {
      default: true,
    },
    buttons: {
      default: () => [],
    },
    selectedB: {
      default: () => {
        return {};
      },
    },
  },
  mounted() {
    this.selectedButton = this.selectedB;
  },
  watch: {
    selected: function () {
      this.selectedButton = this.selectedB;
    },
  },
};
</script>
