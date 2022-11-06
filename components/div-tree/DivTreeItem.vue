<template>
  <div
    class="item border border-2 px-3"
    @click="onItemClick()"
    :style="[
      {
        backgroundColor: color,
        color: lightenDarkenColor(color, colorShift),
      },
      style,
    ]"
  >
    {{ title }}
  </div>
  <div
    class="item-children"
    :class="{ 'show-stuff': children.length > 0 }"
    v-if="children.length > 0"
  >
    <DivTreeItem v-bind="item" v-for="item in children" :key="item" />
  </div>
</template>
<script>
import { lightenDarkenColor } from '@/custom/helpers/ColorHelper';

export default {
  props: {
    title: {
      default: 'موضوع',
    },
    color: {
      default: '#292961',
    },
    colorShift: {
      default: 200,
    },
    style: {
      default: () => ({}),
    },
    children: {
      default: () => [],
    },
    click: {
      default: () => () => {
        //
      },
    },
  },
  setup(props) {
    const childrenCount = (data) => {
      if (data.children)
        return data.children.filter((e) => !!e['children']).length;
      return 0;
    };
    const onItemClick = (item) => {
      props.click();
    };

    return {
      // functions
      lightenDarkenColor,
      childrenCount,

      // event functions
      onItemClick,
    };
  },
};
</script>
<style scoped>
.item {
  border-radius: 10px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
