<template>
  <div class="infinite-scroll-item">
    {{ conf.toText(data) }}
  </div>
</template>
<script lang="ts">
import {PropType} from "vue";
import {InfiniteScrollContainerConf} from "@/custom/components/InfiniteScrollContainerConf";

export default {
  props: {
    conf: {
      type: Object as PropType<InfiniteScrollContainerConf>
    },
    data: {
      type: Object
    },
  },
}
</script>