<style>
.the-spinner {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
<script lang="ts">
import {
  defineComponent,
  h,
  nextTick,
  onMounted,
  ref,
  toRefs,
  watch,
} from "vue";

export default defineComponent({
  props: ["promise", "loading"],
  setup(props, context) {
    const spinnerContainer = ref();
    const { promise, loading } = toRefs(props);
    const localLoading = ref(!!loading.value);

    watch(loading, () => {
      localLoading.value = loading.value;
    });

    watch(promise, () => {
      // console.log("new promise");
      localLoading.value = true;
      promise.value
        .then(() => (localLoading.value = false))
        .catch(() => (localLoading.value = false));
    });

    return () => {
      return h(
        "div",
        {
          class: "position-relative",
        },
        [
          localLoading.value
            ? h(
                "div",
                {
                  class:
                    "d-flex align-items-center align-content-center justify-content-center the-spinner",
                },
                h("span", {
                  class: "spinner-border text-primary",
                  role: "status",
                })
              )
            : undefined,
          context!.slots!.default!(),
        ]
      );
    };
  },
});
</script>
