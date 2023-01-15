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
    },
    filter: {
      type: Object as PropType<Array<any>>,
    }
  },
  setup(props) {
    let list: Ref<any>;
    if (props.list) {
      if (isRef(props.list)) {
        list = props.list;
      } else {
        list = ref(props.list);
      }
    } else if (props.conf.list) {
      if (isRef(props.conf.list)) {
        console.log("infinite", props.conf.list);
        list = props.conf.list;
      } else {
        list = ref(props.conf.list);
      }
    } else {
      list = ref([]);
    }
    let filter: Ref<any>;
    if (props.filter) {
      if (isRef(props.filter)) {
        filter = props.filter;
      } else {
        filter = ref(props.filter);
      }
    } else if (props.conf.filter) {
      if (isRef(props.conf.filter)) {
        filter = props.conf.filter;
      } else {
        filter = ref(props.conf.filter);
      }
    } else {
      filter = ref({});
    }


    let finished = false;
    let loading = ref(false);
    let page = 1;
    let viewItems: Array<any> = [];

    let timer: any;
    let filterChangeTimer: any;
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

          if (filters.length == 0) return true;

          let isOk = true;

          filters.forEach((e) => {
            if (!isOk) return;

            isOk = item[e] == filter.value[e];
          });

          return isOk;
        }).map((item) => {
          return buildItem(item);
        });
        return;

      }

      if (page == 1) {
        viewItems = [];
      }

      loading.value = true;
      props.conf.service?.list(undefined, {
        ...filter.value,
        ...{page}
      }).then(({data}) => {
        list.value.push(...data.results);
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

    onMounted(() => {

      watch(filter, () => {

        clearTimeout(filterChangeTimer);
        filterChangeTimer = setTimeout(() => {
          page = 1;
          finished = false;
          loading.value = false;
          loadData();
        }, 300);
      }, {
        deep: true,
      })

      watch(list, () => {
        if (!props.conf.service) loadData();
        if (infiniteItemsContainer == null || infiniteItemsInnerContainer == null) {
          nextTick(() => loadElement());
        }
      }, {
        deep: true,
      });

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

    const cardContent = () => {

      if (props.conf.filterCounter.value % 2 != 0)
        return;

      if (list.value.length === 0 || viewItems.length === 0) {
        return h(
            'div',
            {
              class: 'infinite-scroll-empty-container',
            },
            [
              h(resolveComponent("inline-svg",), {
                src: "media/icons/light/inbox.svg",
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
            ...viewItems.filter(props.conf.filterViews),
            loading.value && props.conf.service ? h(Spinner, {}, h(
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
    padding: 6px 0 !important;
    margin: 0 !important;
    max-height: 300px;
    overflow-y: scroll;
  }

  .infinite-scroll-empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    svg {
      width: 100px;
      height: 100px;

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