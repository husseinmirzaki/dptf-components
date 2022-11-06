<script lang="ts">
import { defineComponent, h, useSlots } from 'vue';

export default defineComponent({
  setup() {
    return () => h('tr', {}, useSlots());
  },
});
</script>
