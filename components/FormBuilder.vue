<template>
  <div class="row">
    <template v-for="(field, index) in fieldsC" :key="index">
      <template v-if="field.hasVModelKey">
        <field-component
          v-bind="field.vBind"
          :model-value="
            field.options['v-model'].value[field.options['v-model-key']]
          "
          @update:modelValue="
            field.options['v-model'].value[field.options['v-model-key']] =
              $event
          "
        />
      </template>
      <template v-else-if="field.hasVModel">
        <field-component
          v-bind="field.vBind"
          v-model="field.options['v-model'].value"
        />
      </template>
      <template v-else>
        <field-component v-bind="field.vBind" />
      </template>
    </template>
    <slot name="more-fields"/>
  </div>
</template>
<script type="ts">
import { computed, defineComponent, toRef } from "vue";
import FieldComponent, { fieldC } from "@/custom/components/FieldComponent";

export default defineComponent({
  components: { FieldComponent },
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
