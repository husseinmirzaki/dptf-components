import { ref } from 'vue';

export default function (formClass) {
  return {
    update: ref<boolean>(false),
    formContainer: ref<any>(null),
    obj: ref<any>({}),
    formInstance: new formClass(),
  };
}
