<template>
  <div class="m-0" ref="root">
    <h1 class="text-gray-800 fw-bold mb-6 mx-5">پروژه ها</h1>

    <div class="mb-10">
      <template v-for="project in projects" :key="project.id">
        <AsideProject :project="project"/>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, nextTick, onMounted} from "vue";
import axios from "axios";
import AsideProject from "@/custom/components/AsideProject.vue";
import {onScrollLoader} from "@/custom/helpers/OnScrollLoader";
import {boolResolver} from "@/custom/helpers/PromiseHelper";

export default defineComponent({
  components: {AsideProject},
  setup() {
    const {
      elements,
      getData,
      onPage
    } = onScrollLoader();
    // refs

    // methods
    getData.value = (page) => {
      const n = new URLSearchParams({
        access_token: "ynWNGbivksJ7fgrSzZnK",
        page: String(page)
      });
      return boolResolver((ok, fail) => {
        axios.get(`https://git.kashandevops.ir/api/v4/projects?${n}`).then(({data}) => {
          if (data.length > 0) {
            elements.value.push(...data as []);
            // do this so elements are passed to elements
            nextTick(() => {
              ok();
            })
          }
          ok(false);
        }).catch(() => fail());
      });
    }

    onMounted(() => {
      getData.value(0);
    });

    return {
      projects: elements,
      onPage
    }
  },
})
</script>