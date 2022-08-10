<script lang="ts">
import Card from "@/custom/components/Card.vue";
import {defineComponent, h} from "vue";

export default defineComponent({
  props: {
    activationKey: String,
  },
  name: "MapToolsWindow",
  render() {
    return h(Card, {
      bodyPaddingClass: 'p-1',
      disableDrag: true,
      'class': ['w-100 bg-light']
    }, this.$slots);
  }
})
</script>