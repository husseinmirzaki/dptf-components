<template>
  <table-t-d style="direction: ltr;">
    <template v-for="(item, i) in data" :key="i">
      <router-link v-if="item.type==='link'" :to="item.to" class="btn btn-sm my-1 px-3 mx-1" :class="`btn-${item.color}`"
                   data-toggle="tooltip" data-theme="dark" :title="item.tooltip">
        <i v-if="item.icon" :class="item.icon" class="px-0"></i>
        {{ item.text }}
      </router-link>
      <button v-else-if="item.type==='button'" class="btn btn-sm my-1 px-3 mx-1" :class="`btn-${item.color}`"
              data-toggle="tooltip" data-theme="dark" :title="item.tooltip"
              @click="VueInstanceService.emit(item.tableName, [item.eventName, item.id])">
        <i v-if="item.icon" :class="item.icon"></i>
        {{ item.text }}
      </button>
    </template>
  </table-t-d>
</template>
<script lang="ts">
import {defineComponent, toRef} from "vue";
import TableTD from "@/custom/components/table/tbody/TableTD.vue";
import {VueInstanceService} from "@/Defaults";

export default defineComponent({
  components: {TableTD},
  props: ['data'],
  setup() {
    return {
      VueInstanceService
    }
  }
});
</script>