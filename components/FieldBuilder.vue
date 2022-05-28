<template>
  <template v-if="cField.hasVModelKey">
    <field-component
        v-bind="cField.vBind"
        :model-value="
          cField.options['v-model'].value[cField.options['v-model-key']]
        "
        @update:modelValue="
          cField.options['v-model'].value[cField.options['v-model-key']] =
            $event
        "
    />
  </template>
  <template v-else-if="cField.hasVModel">
    <field-component
        v-bind="cField.vBind"
        v-model="cField.options['v-model'].value"
    />
  </template>
  <template v-else>
    <field-component v-bind="cField.vBind"/>
  </template>
</template>
<script type="ts">
import {computed, defineComponent, toRef} from "vue";
import FieldComponent, {fieldC} from "@/custom/components/FieldComponent";
import {ref} from "vue";

export default defineComponent({
  components: {FieldComponent},
  props: ['field'],
  setup(props) {
    const field = toRef(props, 'field');
    const cField = computed(() => field.value)
     return {
      cField
     }
  }
});
</script>
