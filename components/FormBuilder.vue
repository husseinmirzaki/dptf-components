<template>
  <div class="row">
    <template v-for="field in fieldsC" :key="field.options.name">
      <field-builder :field="field" />
    </template>
    <slot name="more-fields" />
  </div>
</template>
<script type="ts">
import { computed, defineComponent, toRef } from "vue";
import FieldComponent, { fieldC } from "@/custom/components/FieldComponent";
import FieldBuilder from "@/custom/components/FieldBuilder.vue";

export default defineComponent({
  components: {FieldBuilder, },
  name: "form-builder",
  props: {
    fields: {
      default: () => {
        return [];
      },
      type: Array
    }
  },
  setup(props) {
    const fields = toRef(props, 'fields');
    const fieldsC = computed(() => {
      const fieldsC = [];
      fields.value.forEach((e) => {
        fieldsC.push(fieldC(e));
      });
      return fieldsC;
    });
    // console.log(fieldsC);
    return { fieldsC };
  },
});
</script>
