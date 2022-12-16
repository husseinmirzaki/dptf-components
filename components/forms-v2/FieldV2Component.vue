<script lang="ts">
import {defineComponent, h, PropType, ref} from "vue";
import {FieldV2DefaultProps} from "@/custom/components/forms-v2/FieldV2DefaultProps";

export const NO_IMPORT_FIELDS = [
  'text',
  'number',
  'textarea'
];

export default defineComponent({
  props: FieldV2DefaultProps,
  setup(props) {
    const loading = ref(props.type && NO_IMPORT_FIELDS.indexOf(props.type) == -1);

    const onData = (e) => {
      console.log(e);
    }

    let field: any;
    if (loading.value)
      import("@/custom/components/forms-v2/FieldV2Checkbox.vue").then((e) => {
        field = e.default;
        loading.value = false;
      });

    return () => {
      if (loading.value || !props.type)
        return;

      if (NO_IMPORT_FIELDS.indexOf(props.type) == -1)
        return h(
            field,
            {
              onData: onData,
              ...props,
            }
        )

      const defaultProps = {
        value: props.defaultValue,
        placeholder: props.placeholder,
        onChange: (e) => onData(e.target.value),
        class: [
          'form-control field-v2-form-control',
          {
            'form-control-sm': props.size == 'sm',
            'form-control-lg': props.size == 'lg',
          }
        ],
      }

      if (props.type == "textarea")
        return h(
            "textarea",
            {
              ...defaultProps,
            }
        )

      return h(
          "input",
          {
            type: props.type,
            ...defaultProps,
          },
      )

    }
  }
})
</script>
<style lang="scss">
.field-v2-form-control {
  font-size: 13px;
  padding: 5px 6px;
  &.form-control-sm {
    font-size:11px;
    padding: 4px 5px;
  }
  &.form-control-lg {
    font-size:14px;
  }
}
</style>