<template>
  <div ref="spinnerContainer" class="spinner">
    <slot/>
  </div>
</template>
<style>

.the-spinner {
  position: absolute;
  background-color: rgba(0,0,0,0.05);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

</style>
<script lang="ts">
import {computed, defineComponent, nextTick, onMounted, ref, toRefs, watch} from "vue";

export default defineComponent({
  props: ['promise', 'loading'],
  setup(props) {
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

    watch(localLoading, (e) => {
      console.log("changed", e);
      if (e) addLoader();
      else removeLoader();
    });

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
          console.log(computedStyleMap);

          child.classList.add('position-relative');
          (loader.children[0] as HTMLElement).style.borderRadius = computedStyleMap.get('border-radius').toString();
          return child.append(loader.children[0]);
        })
      }
    }

    const removeLoader = () => {
      if (spinnerContainer.value) {
        console.log("removing spinner containers")
        nextTick(() => {
          nextTick(() => {
            setTimeout(() => {
              spinnerContainer.value.classList.remove('position-relative');
              spinnerContainer.value.querySelectorAll('.the-spinner').forEach((e) => {
                if (e) e.remove();
              });
            }, 500);
          });
        });
      }
    }

    return {
      spinnerContainer,
    }
  }
});
</script>