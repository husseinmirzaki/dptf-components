<script lang="ts">
import {defineComponent, h, ref} from "vue";
import FieldComponent from "@/custom/components/FieldComponent.vue";

export default defineComponent({
  setup() {
    const currentValue: any = ref();

    return () => {
      return h(
          FieldComponent,
          {
            field_type: 'select',
            select_multiple: true,
            select_tag: true,
            modelValue: currentValue.value,
            'onUpdate:modelValue': (e) => currentValue.value = e,
          }
      );
    }
  }
});
</script>