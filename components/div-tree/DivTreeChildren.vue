<template>
  <div class="item-children" :class="{ 'show-stuff': childrenCount > 0 }">
    <DivTreeItem :item="item" v-for="item in $attrs.items" :key="item" />
  </div>
</template>
<script>
import DivTreeItem from "@/custom/components/div-tree/DivTreeItem.vue";
export default {
  components: { DivTreeItem },
  setup() {
    const childrenCount = (data) => {
      if (data.children)
        return data.children.filter((e) => !!e["children"]).length;
      return 0;
    };

    return {
      childrenCount,
    };
  },
};
</script>
