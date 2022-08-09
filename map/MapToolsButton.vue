<template>
  <el-tooltip :content="hint">
    <div
        @mouseenter="$emit('update:state', hint)"
        @mouseleave="$emit('update:state', '')"
        @click.stop="$emit('update:activeKey', windowActivationKey)"
        :class="['icon', {active: isActive}]"
        :style="style"></div>
  </el-tooltip>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "MapToolsButton",
  props: {
    windowActivationKey: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
    hint: {
      type: String,
    },
    iconUrl: {
      type: String
    },
  },
  setup(props) {
    return {
      style: {
        backgroundImage: `url('${props.iconUrl}')`,
      }
    }
  }
});
</script>
<style lang="scss" scoped>
.icon {
  margin-bottom: 5px;
  width: 35px;
  height: 35px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 1px rgba(0, 0, 0, .9);
  transition: all 120ms ease;
  background-size: 25px 25px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.9);
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 3px rgba(0, 0, 0, 1) inset;
  }

}
</style>