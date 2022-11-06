<template>
  <table-t-d>
    <el-tooltip :content="`رنگ انتخاب شما ${data} است`">
      <div class="color-container" :style="{ 'background-color': data }"></div>
    </el-tooltip>
  </table-t-d>
</template>
<style scoped>
.color-container {
  margin: 1px;
  box-shadow: 0 0 1px #000;
  width: 100%;
  height: 20px;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import TableTDMixin from '@/custom/mixins/TableTDMixin';
import TableTD from '@/custom/components/table/tbody/TableTD.vue';

export default defineComponent({
  components: { TableTD },
  mixins: [TableTDMixin],
  props: ['data', 'emptyCell'],
  computed: {
    computedValue: function () {
      if (this.data) {
        if (this.data.value) {
          return this.data.value;
        } else {
          return this.data;
        }
      }
      return null;
    },
  },
  methods: {
    truncate(data) {
      if (data && data.length > 80) {
        return data.substr(0, 80) + '...';
      }
      return data;
    },
    len(data) {
      if (data && data.length) {
        return data.length;
      }
      return 0;
    },
  },
});
</script>
