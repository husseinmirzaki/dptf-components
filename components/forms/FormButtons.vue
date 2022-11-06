<script lang="ts">
import { defineComponent, h } from 'vue';
import PromiseButton from '@/custom/components/PromiseButton.vue';
import { DEFAULT_BUTTONS } from '@/custom/helpers/RenderFunctionHelpers';

export default defineComponent({
  setup() {
    return () => {
      return [h(PromiseButton), DEFAULT_BUTTONS.primary({}, {})];
    };
  },
});
</script>
