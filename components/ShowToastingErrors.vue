<template>
  <div class="d-none"></div>
</template>

<script>
import {toRef, watch} from "vue";
import {VueInstanceService} from "@/custom/helpers/VueInstanceService";

export default {
  props: ['submitCount', 'validate'],
  setup(props) {
    const submitCount = toRef(props, 'submitCount');
    const validate = toRef(props, 'validate');
    watch(submitCount, () => {
      validate.value().then((data) => {
        if (Object.keys(data.errors).length > 0) {
          for (let i = 0; i < Object.keys(data.errors).length; i++) {
            setTimeout(() => {
              VueInstanceService.showErrorMessage(data.errors[Object.keys(data.errors)[i]], 'فیلد اشتباه', 5000);
            }, 100 * i);
          }
        }
      });
    });
  }
}
</script>