import { ref } from "vue";

export function modalExtend(options: Record<string, any> | null = null) {
  const defaultOptions = {
    onOpen: (e) => {
      //
    },
    onClose: (e) => {
      //
    },
    onOpened: (e) => {
      //
    },
  };

  if (options != null) Object.assign(defaultOptions, options);

  const modal = ref<any>();
  const assignSubmit = ref<any>();
  return {
    assignSubmit,
    modal,
    onOpen: (e) => {
      defaultOptions.onOpen(e);
    },
    onOpened: (e) => {
      defaultOptions.onOpened(e);
    },
    onClose: (e) => {
      defaultOptions.onClose(e);
    },
    open: (e) => {
      modal.value.open(e);
    },
    close: (e) => {
      modal.value.close(e);
    },
  };
}
