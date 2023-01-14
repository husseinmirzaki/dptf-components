<script lang="ts">
import {defineComponent, h, isRef, nextTick, onMounted, PropType, Ref, ref, resolveComponent, toRef, watch} from "vue";
import Card from "@/custom/components/Card.vue";
import Spinner from "@/custom/components/Spinner.vue";
import {InfiniteScrollContainerConf} from "@/custom/components/InfiniteScrollContainerConf";

export default defineComponent({
  components: {Spinner, Card},
  props: {
    conf: {
      type: Object as PropType<InfiniteScrollContainerConf>,
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: Object as PropType<Array<any>>,
      default: () => ({}),
    }
  },
  setup(props) {
    const items: Ref<Array<any>> = ref([]);

    const list: Ref<any> = isRef(props.list) ? props.list : ref(props.list);
    const filter: Ref<any> = isRef(props.filter) ? props.filter : ref(props.filter);

    let finished = false;
    let loading = ref(false);
    let page = 1;

    let timer: any;
    let infiniteItemsContainer: any;
    let infiniteItemsInnerContainer: any;

    const onScroll = () => {
      if (loading.value || finished) return;
      const end = infiniteItemsInnerContainer["offsetHeight"] - infiniteItemsContainer["offsetHeight"];
      if (infiniteItemsContainer["scrollTop"] > end) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          loadData();
        }, 500);
      }

    };

    const buildItem = (item) => {
      return h(
          props.conf.itemComponent,
          {
            conf: props.conf,
            data: item
          }
      );
    }

    const loadData = () => {
      if (!props.conf.service && !list.value) {
        return;
      }

      if (!props.conf.service) {
        const filters = Object.keys(filter.value);
        viewItems = list.value.filter((item) => {

          if (filters.length == 0) return  true;

          let isOk = true;

          filters.forEach((e) => {
            if (!isOk) return;

            isOk = item[e] == filter.value[e];
          });

          return isOk;
        }).map((item) => {
          return buildItem(item);
        });
      }

      if (page == 1) {
        viewItems = [];
      }

      loading.value = true;
      props.conf.service?.list(undefined, {
        ...filter.value,
        ...{page}
      }).then(({data}) => {
        items.value.push(...data.results);
        data.results.forEach((item) => {
          viewItems.push(buildItem(item));
        });
        loading.value = false;
        page++;
      }, (error) => {
        finished = error.response.status == 404;
        loading.value = false
      });
    }

    const loadElement = () => {
      infiniteItemsContainer = document.querySelector(".infinite-scroll-item-container");
      infiniteItemsInnerContainer = document.querySelector(".infinite-scroll-inner-items-container")!;
    }

    watch(items.value, () => {
      if (infiniteItemsContainer == null || infiniteItemsInnerContainer == null) {
        nextTick(() => loadElement());
      }
    }, {
      deep: true,
    });

    onMounted(() => {
      loadElement();

      loadData();

      nextTick(() => {
        if (infiniteItemsContainer != null) {
          infiniteItemsContainer.addEventListener(
              "scroll", onScroll
          );
        }
      });
    });


    // stuff
    let viewItems: Array<any> = [];
    const cardContent = () => {

      if (items.value.length === 0) {
        return h(
            'div',
            {
              class: 'infinite-scroll-empty-container',
            },
            [
              h(resolveComponent("inline-svg",), {
                src: "media/icons/light/inbox.svg",
                width: 100,
                height: 100,
              }),
              h("p", {class: "error-text"}, "هیچ داده ای برای نمایش وجود ندارد")
            ]
        );
      }

      return h(
          'div',
          {
            class: 'infinite-scroll-inner-items-container',
          },
          [
            ...viewItems,
            loading.value ? h(Spinner, {}, h(
                'div',
                {
                  class: 'infinite-scroll-item',
                },
                "در حال بارگیری"
            )) : undefined
          ]
      );
    }

    return () => {
      return h(Card, {
        class: 'infinite-scroll-container',
        bodyPaddingClass: 'infinite-scroll-item-container',
      }, {
        "card-content": cardContent,
      });
    }
  }
});
</script>
<style lang="scss">
.infinite-scroll-container {
  padding: 0 !important;

  .infinite-scroll-item-container {
    padding: 6px !important;
    margin: 0 !important;
    max-height: 300px;
    overflow-y: scroll;

    .infinite-scroll-item {
      padding: 10px;
      margin: 2px;
    }
  }

  .infinite-scroll-empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    svg {
      path, g {
        fill: red;
      }
    }

    .error-text {
      margin-top: 20px;
      font-size: 18px;
    }
  }
}
</style>