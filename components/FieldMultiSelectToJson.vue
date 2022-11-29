<script lang="ts">
import {defineComponent, h, onMounted, ref} from "vue";
import FieldComponent from "@/custom/components/FieldComponent.vue";

export default defineComponent({
  emits: ['update:modelValue'],
  setup(props, context) {
    const currentValue: any = ref();
    let refField: any;

    context.expose({
      setData: (d) => {
        refField.setValue(d);
      }
    })

    return () => {
      return h(
          FieldComponent,
          {
            ref: (el) => refField = el,
            field_type: 'select',
            select_multiple: true,
            select_tag: true,
            modelValue: currentValue.value,
            'onUpdate:modelValue': (e) => context.emit('update:modelValue', JSON.stringify(e)),
          }
      );
    }
  }
});
</script>