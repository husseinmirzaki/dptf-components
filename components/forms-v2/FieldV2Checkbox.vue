<template>
  <div class="form-check field-v2-checkbox" @change.stop="onChange">
    <input
        class="form-check-input"
        type="checkbox"
        :checked="defaultValue"
        :id="id">
    <label class="form-check-label" :for="id">
      {{ label }}
    </label>
  </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {FieldV2DefaultEmits, FieldV2DefaultProps} from "@/custom/components/forms-v2/FieldV2DefaultProps";

export default defineComponent({
  emits: FieldV2DefaultEmits,
  props: FieldV2DefaultProps,
  setup(props, context) {
    const onChange = (e) => {
      context.emit("data", e.target.checked);
    };

    return {
      onChange
    }
  }
});
</script>
<style lang="scss">
.field-v2-checkbox {
  .form-check-input {
    float: right;
    margin-right: -2.25rem;
    margin-left: 0;
  }
}
</style>