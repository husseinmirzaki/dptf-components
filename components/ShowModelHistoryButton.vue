<script lang="ts">
import { defineComponent, h } from 'vue';
import { DEFAULT_BUTTONS } from '@/custom/helpers/RenderFunctionHelpers';
import { ElTooltip } from 'element-plus';
import { VueInstanceService } from '@/Defaults';

export default defineComponent({
  props: ['modelName'],
  setup(props, context) {
    return () => {
      return h(
        ElTooltip,
        {
          content: 'تاریخچه',
        },
        () =>
          DEFAULT_BUTTONS.icon_1(
            {
              onClick: () => {
                VueInstanceService.emit('show-history', [
                  'open',
                  props.modelName,
                ]);
              },
            },
            {
              class: 'svg-icon-2x history-icon-color',
              src: 'media/icons/history.svg',
            }
          )
      );
    };
  },
});
</script>
<style lang="scss">
.history-icon-color {
  fill: #3c465e;
}
</style>
