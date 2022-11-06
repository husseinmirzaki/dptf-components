<template>
  <!--begin::Pagination-->
  <div
    class="d-flex justify-content-center flex-wrap w-100"
    style="direction: ltr"
  >
    <div class="d-flex flex-wrap py-2 mr-3">
      <a
        @click.prevent="prevPage"
        class="btn btn-icon btn-sm border-0 btn-light mx-2 my-1"
      >
        &lt;
      </a>
      <a
        v-for="i in pages"
        :key="i"
        @click="$emit('pageSelected', i)"
        :class="{
          active: isActive(i),
        }"
        class="btn btn-icon btn-sm border-0 btn-light mx-2 my-1"
      >
        {{ i }}
      </a>
      <a
        @click.prevent="nextPage"
        class="btn btn-icon btn-sm border-0 btn-light mx-2 my-1"
      >
        &gt;
      </a>
    </div>
  </div>
  <!--end:: Pagination-->
</template>
<script>
import { computed, defineComponent, toRefs } from 'vue';
import { Configs } from '@/Defaults';
import { closeAllOpenInstance } from '@/custom/helpers/select2_decelaration';

export default defineComponent({
  props: {
    count: {
      default: 1000,
    },
    perPage: {
      default: Configs.tablePerPage,
    },
    currentPage: {
      default: 0,
    },
  },
  emits: ['pageSelected'],
  setup(props, context) {
    const { count, perPage, currentPage } = toRefs(props);
    const pages = computed(() => {
      if (count.value <= perPage.value) {
        return [1];
      } else {
        const current_page = currentPage.value;
        const last_page = Math.ceil(count.value / perPage.value);
        // pages
        let _pages = [];
        let onSides = 3;
        // Loop through
        for (let i = 1; i <= last_page; i++) {
          // Define offset
          let offset = i === 1 || last_page ? onSides + 1 : onSides;
          // If added
          if (
            i === 1 ||
            (current_page - offset <= i && current_page + offset >= i) ||
            i === current_page ||
            i === last_page
          ) {
            _pages.push(i);
          } else if (
            i === current_page - (offset + 1) ||
            i === current_page + (offset + 1)
          ) {
            _pages.push('...');
          }
        }
        return _pages;
      }
    });

    const isActive = (i) => {
      return Number(i) === currentPage.value;
    };

    const nextPage = () => {
      closeAllOpenInstance();
      if (count.value > 0)
        if (Math.ceil(count.value / perPage.value) > currentPage.value) {
          context.emit('pageSelected', currentPage.value + 1);
        }
    };

    const prevPage = () => {
      closeAllOpenInstance();
      if (currentPage.value - 1 === 0) return;

      context.emit('pageSelected', currentPage.value - 1);
    };

    return {
      pages,
      prevPage,
      nextPage,
      isActive,
    };
  },
});
</script>
<style scoped>
a {
  font-weight: 400;
}
</style>
