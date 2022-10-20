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
import {defineComponent, h, nextTick, onMounted, ref, toRefs, watch} from "vue";

export default defineComponent({
  props: ['promise', 'loading'],
  setup(props, context) {
    const spinnerContainer = ref();
    const {promise, loading} = toRefs(props);
    const localLoading = ref(!!loading.value);

    watch(loading, () => {
      localLoading.value = loading.value;
    });

    watch(promise, () => {
      console.log("new promise");
      localLoading.value = true;
      promise.value
          .then(() => localLoading.value = false)
          .catch(() => localLoading.value = false);
    });

    // watch(localLoading, (e) => {
    //   if (e) addLoader();
    //   else removeLoader();
    // });

    onMounted(() => {
      addLoader();
    });

    const addLoader = () => {
      if (spinnerContainer.value && localLoading.value) {
        nextTick(() => {
          const loaderString = "" +
              "      <div class=\"d-flex align-items-center align-content-center justify-content-center the-spinner\">\n" +
              "        <span class=\"spinner-border text-primary\" role=\"status\"></span>\n" +
              "      </div>\n";
          const loader = document.createElement('div');
          loader.innerHTML = loaderString;

          const child = spinnerContainer.value.children[0];
          const computedStyleMap = child.computedStyleMap();

          child.classList.add('position-relative');
          (loader.children[0] as HTMLElement).style.borderRadius = computedStyleMap.get('border-radius').toString();
          return child.append(loader.children[0]);
        })
      }
    }

    return () => {
      const s = context!.slots!.default!()

      if (!localLoading.value)
        return s;

      return h(
          'div',
          {
            class: 'position-relative'
          },
          [
            h(
                'div',
                {
                  // ref: (el: any) => {
                  //   if (s[0].el) {
                  //     console.log(s[0].el)
                  //     const computedStyleMap = s[0].el.computedStyleMap();
                  //     el.style.borderRadius = computedStyleMap.get('border-radius').toString();
                  //   }
                  // },
                  class: "d-flex align-items-center align-content-center justify-content-center the-spinner"
                },
                h(
                    'span',
                    {
                      class: 'spinner-border text-primary',
                      role: 'status',
                    }
                )
            ),
            s
          ]
      )

    }
  }
});
</script>