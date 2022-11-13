<!--<template>-->
<!--  <td>-->
<!--    <slot :computedValue="computedValue">-->
<!--      <el-tooltip-->
<!--          :content="computedValue ? computedValue : emptyCell ? emptyCell : '-'"-->
<!--          v-if="len(data) > 80"-->
<!--      >-->
<!--        <span>-->
<!--          {{-->
<!--            truncate(-->
<!--                computedValue ? computedValue : emptyCell ? emptyCell : "-"-->
<!--            )-->
<!--          }}-->
<!--        </span>-->
<!--      </el-tooltip>-->
<!--      <span v-else>-->
<!--        {{ computedValue ? computedValue : emptyCell ? emptyCell : "-" }}-->
<!--      </span>-->
<!--    </slot>-->
<!--  </td>-->
<!--</template>-->
<script lang="ts">
import {defineComponent, h, isRef, resolveComponent} from "vue";
import TableTDMixin from "@/custom/mixins/TableTDMixin";

export default defineComponent({
  mixins: [TableTDMixin],
  props: ["data", "emptyCell"],
  setup(props, context) {
    const truncate = (data, maxLength) => {
      if (data && data.length > maxLength && typeof data === "string") {
        return data.substr(0, maxLength) + "...";
      }
      return data;
    };
    const len = (data) => {
      if (data && data.length) {
        return data.length;
      }
      return 0;
    };

    return () => {
      const maxTextLength = Number(context.attrs['maxTextLength']) || 80;
      const defaultSlot = context?.slots?.default
      const data = isRef(props.data) ? props.data.value : props.data;
      const lastData = data ? data : props.emptyCell ? props.emptyCell : '-';

      let toShow: any;
      if (defaultSlot)
        toShow = defaultSlot();
      else if (len(lastData) > maxTextLength)
        toShow = h(
            resolveComponent('el-tooltip'),
            {
              content: lastData,
            },
            h(
                'span',
                truncate(lastData, maxTextLength),
            )
        )
      else
        toShow = h(
            'span',
            lastData,
        )

      return h(
          'td',
          toShow
      )
    }
  }
});
</script>
