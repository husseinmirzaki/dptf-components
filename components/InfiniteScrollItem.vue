<template>
  <div class="infinite-scroll-item" :class="{selected: selected}" @click="selectedItem">
    {{ conf.toText(data) }}
  </div>
</template>
<script lang="ts">
import {onMounted, onUnmounted, PropType, ref} from "vue";
import {InfiniteScrollContainerConf} from "@/custom/components/InfiniteScrollContainerConf";
import {VueInstanceService} from "@/Defaults";

export default {
  props: {
    conf: {
      type: Object as PropType<InfiniteScrollContainerConf>,
      required: true,
    },
    data: {
      type: Object
    },
  },
  setup(props) {
    const selected = ref(props.conf.isSelected(props.data));

    const onItems = () => {
      selected.value = props.conf.isSelected(props.data);
    }
    const selectedItem = () => {
      props.conf.selectItem(props.data);
    }

    onMounted(() => {
      VueInstanceService.on(props.conf.eventEmitter, onItems);
    });

    onUnmounted(() => {
      VueInstanceService.off(props.conf.eventEmitter, onItems);
    });

    return {
      selected,
      selectedItem,
    }
  }
}
</script>
<style lang="scss">
.infinite-scroll-item {
  padding: 10px;
  margin: 0 2px;

  &.selected {
    background: #696969;
    color: white;

    &:hover {
      background: #505050;
      color: white;
    }
  }

  &:hover {
    background: #b0b0b0;
    color: white;
  }
}
</style>