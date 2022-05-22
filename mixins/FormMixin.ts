import { randomId } from "@/custom/helpers/random";

export default {
  props: {
    showCancelButton: {
      type: Boolean,
      default: () => false,
    },
    validationSchema: [Object],
    formId: {
      type: String,
      default: () => {
        return `id-form-${randomId(3)}`;
      },
    },
  },
};
