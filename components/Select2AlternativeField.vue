<template>
  <div class="select2-alternative m-0 p-0">
    <div
      class="row text-center w-100 bg-light m-0 position-relative"
      :class="{ 'p-3': !searching, 'p-1': searching }"
    >
      <template v-if="!searching">
        <div
          class="col"
          v-for="header in config.headerTranslates"
          :key="header"
          @click="searching = true"
        >
          <span>{{ header }}</span>
        </div>
        <div class="search-icon" @click="searching = true">
          <span class="svg-icon-primary svg-icon-md">
            <inline-svg src="media/icons/duotune/general/gen021.svg" />
          </span>
        </div>
      </template>
      <div class="col" v-if="searching" :class="{ 'p-0': searching }">
        <input
          type="text"
          class="form-control"
          style="border-radius: 0"
          v-model="searchText"
          placeholder="متنی را تایپ کنید"
        />
      </div>
    </div>
    <div
      class="table-body"
      style="height: 350px; overflow-y: scroll"
      @scroll="onBodyScroll"
    >
      <div
        class="row text-center w-100"
        :class="{ active: itemIsActive(item) }"
        v-for="item in items"
        :key="processText(item, config.identifier)"
        @click="selectItem(item)"
      >
        <div
          class="col d-flex align-items-center justify-content-center"
          v-for="header in config.headers"
          :key="processText(item, header)"
        >
          {{ processText(item, header) }}
        </div>
      </div>
      <div class="row text-center w-100" v-if="loading">
        <div class="col d-flex align-items-center justify-content-center">
          درحال بارگیری
          <span
            class="spinner-border spinner-border-sm align-middle ms-2"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onUnmounted, ref, toRef, watch } from 'vue';
import { ApiService, Configs } from '@/Defaults';

export default defineComponent({
  props: {
    config: {
      default: {
        identifier: 'id',
        headers: [],
        headerTranslates: [],
      },
    },
    url: String,
    filters: Object,
    data: {
      type: Array,
    },
    multiple: {
      default: false,
    },
    modelValue: Object,
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const items: any = ref([]);
    let page = 1;
    const loading = ref(false);
    const finished = ref(!props.url);
    const searching = ref(false);
    const searchText = ref('');

    let _selectedItem: any;
    if (props.multiple) {
      // eslint-disable-next-line vue/no-setup-props-destructure
      _selectedItem = props.modelValue ? props.modelValue : [];
    } else {
      if (props.modelValue == undefined) {
        _selectedItem = -1;
      } else {
        _selectedItem = props.modelValue!;
      }
    }

    const selectedItem: any = ref(_selectedItem);

    const onBodyScroll = (e) => {
      if (
        e.target.offsetHeight + e.target.scrollTop + 60 >=
          e.target.scrollHeight &&
        !loading.value &&
        !finished.value
      ) {
        page++;
        getData();
      }
    };

    if (props.filters) {
      watch(
        toRef(props, 'filters'),
        () => {
          getData();
        },
        {
          deep: true,
        }
      );
    }

    if (props.url) {
      watch(toRef(props, 'url'), () => {
        getData();
      });
    }

    const getData = () => {
      loading.value = true;

      const urlParams = new URLSearchParams();

      if (props.filters)
        Object.keys(props.filters).forEach((key) => {
          urlParams.set(key, props.filters![key]);
        });

      if (searchText.value != '' && searchText.value.length > 3) {
        urlParams.set('search', searchText.value);
      }

      urlParams.set('page', String(page));

      const promise = ApiService.get(props.url!, { params: urlParams });
      promise.then(() => {
        loading.value = false;
      });
      promise.then(({ data }) => {
        if (data.results) {
          items.value.push(...data.results);
          finished.value = data.results.length < Configs.tablePerPage;
          if (!finished.value) {
            page++;
            getData();
          }
        }
      });
    };

    if (props.url) getData();

    const globalKeydown = (e) => {
      if (e.code == 'Escape' || e.key == 'Escape' || e.keyCode == 27) {
        searching.value = false;
      }
    };

    const selectItem = (item) => {
      if (!props.multiple) {
        if (selectedItem.value != item[props.config.identifier])
          selectedItem.value = item[props.config.identifier];
        else selectedItem.value = -1;
        context.emit('update:modelValue', selectedItem.value);
        return;
      }

      const index = selectedItem.value.indexOf(item[props.config.identifier]);

      if (index == -1) {
        selectedItem.value.push(item[props.config.identifier]);
      } else {
        selectedItem.value.splice(index, 1);
      }

      context.emit('update:modelValue', selectedItem.value);
    };

    const itemIsActive = (item) => {
      if (props.multiple) {
        return selectedItem.value.indexOf(item[props.config.identifier]) > -1;
      }
      return selectedItem.value == item[props.config.identifier];
    };

    const processText = (
      item: any,
      header: string | number | ((x: any) => any)
    ) => {
      if (typeof header == 'function') {
        return header(item);
      }

      return item[header];
    };

    onUnmounted(() => {
      document.removeEventListener('keydown', globalKeydown);
    });

    watch(searching, () => {
      if (searching.value) {
        document.addEventListener('keydown', globalKeydown);
      } else {
        document.removeEventListener('keydown', globalKeydown);
      }
    });

    return {
      items,
      loading,
      searching,
      searchText,
      selectedItem,

      // functions
      processText,
      itemIsActive,

      // event functions
      selectItem,
      onBodyScroll,
    };
  },
});
</script>
<style scoped lang="scss">
.search-icon {
  position: absolute;
  top: 50%;
  right: 0;
  width: 25px;
  height: 25px;
  transform: translateY(-50%);
}

.select2-alternative {
  background: #ffffff;
  padding: 5px;
}

.table-body {
  > .row {
    margin-right: 0;
    border-bottom: 1px #bfeefb solid;

    &.active,
    &:hover {
      background-color: #a8a1a1;
    }

    &.active {
      background-color: #586cdc;
      color: #ffffff;
    }

    > .col {
      padding: 15px;
    }
  }
}

.table {
}
</style>
