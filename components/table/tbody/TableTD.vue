<template>
  <td>
    <slot :computedValue="computedValue">
      <el-tooltip
        :content="computedValue ? computedValue : emptyCell ? emptyCell : '-'"
        v-if="len(data) > 80"
      >
        <span>
          {{
            truncate(
              computedValue ? computedValue : emptyCell ? emptyCell : '-'
            )
          }}
        </span>
      </el-tooltip>
      <span v-else>
        {{ computedValue ? computedValue : emptyCell ? emptyCell : '-' }}
      </span>
    </slot>
  </td>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import TableTDMixin from '@/custom/mixins/TableTDMixin';

export default defineComponent({
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
      if (data && data.length > 80 && typeof data === 'string') {
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
