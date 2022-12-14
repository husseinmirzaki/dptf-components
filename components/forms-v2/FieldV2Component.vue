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
              ...props
            }
        )

      if (props.type == "textarea")
        return h(
            "textarea",
            {
              class: 'form-control',
            }
        )

      return h(
          "input",
          {
            class: 'form-control',
            type: props.type,
          },
      )

    }
  }
})
</script>