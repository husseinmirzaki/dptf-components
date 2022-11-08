<template>
  <a
    ref="root"
    href="#"
    class="custom-list d-flex align-items-center px-5 py-4"
  >
    <div class="symbol symbol-40px me-5">
      <span class="symbol-label">
        <img
          src="media/svg/brand-logos/bebo.svg"
          class="h-50 align-self-center"
          alt=""
        />
      </span>
    </div>

    <div class="d-flex flex-column flex-grow-1">
      <h5 class="custom-list-title fw-bold text-gray-800 mb-1">
        {{ $props.project.name }}
      </h5>

      <span class="text-gray-400 fw-bold">{{ description }}</span>
    </div>
  </a>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRef, toRefs } from "vue";
import axios from "axios";

export default defineComponent({
  props: ["project"],
  setup(props) {
    const { project } = toRefs(props);
    const root = ref();

    const description = computed(() => {
      let text = project.value.description;
      if (text == "") text = project.value.description;

      if (text == "") {
        if (project.value.tag_list && project.value.tag_list.length > 0) {
          text = project.value.tag_list[0];
        }
      }

      if (text == "") {
        text = "داده اضافه";
      }
      return text.slice(0, 15);
    });

    onMounted(() => {
      if (root.value) {
        project.value["element"] = root.value;
      }
    });

    return {
      description,
      root,
    };
  },
});
</script>
