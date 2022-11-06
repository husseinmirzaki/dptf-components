import { ref } from 'vue';

export function onScrollLoader() {
  const elements = ref([]);
  const scrollRequest = ref(false);
  const scrollPage = ref(1);
  const getData = ref();

  const onPage = (e) => {
    const lastChild = elements.value[elements.value.length - 1][
      'element'
    ] as HTMLElement;
    if (window.innerHeight > lastChild.getBoundingClientRect().top) {
      getDataController();
    }
  };

  const getDataController = () => {
    if (!scrollRequest.value && getData.value) {
      scrollRequest.value = true;
      getData
        .value(scrollPage.value)
        .then(() => {
          scrollRequest.value = false;
          scrollPage.value++;
        })
        .catch(() => {
          scrollRequest.value = false;
        });
    }
  };

  return {
    // methods
    onPage,
    // refs
    elements,
    scrollPage,
    getData,
  };
}
