<template>
  <div
      ref="mainContainer"
      :class="{
      'd-flex': vertical,
    }"
  >
    <div
        dir="ltr"
        class="d-flex tab-items-container w-100"
        :class="{
        'flex-column justify-content-start align-items-end is-vertical':
          vertical,
        'justify-content-center align-items-center': !vertical,
      }"
        ref="container"
    >
      <slot name="tabs" v-if="show" :setActiveItem="setActiveItem"/>
    </div>
    <div
        class="d-flex justify-content-center align-items-center w-100 pb-7 tab-content-container"
        ref="tabContainerBody"
    >
      <slot
          name="tab-container"
          :tabNames="tabNames"
          :activeItem="activeItem"
          :routerMode="routerMode"
          :bodyHeight="bodyHeight"
      >
        <router-view v-if="routerMode && !disableRouterView"/>
        <slot v-else-if="!disableRouterView" :name="tabNames[activeItem]"/>
      </slot>
    </div>
  </div>
</template>
<script>
import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {VueInstanceService} from "@/Defaults";
import {SimpleDrag} from "@/custom/components/table/TableDrag";
import {UserPreferencesManager} from "@/custom/services/UserPreferencesV2Api";
import {findClassInParent} from "@/custom/helpers/DomHelpers";
import {useRoute} from "vue-router";
import Sortable from "sortablejs";

export default {
  props: {
    activeIndex: {
      default: 0,
    },
    routerPrefix: {
      default: "",
    },
    routerMode: {
      default: false,
    },
    disableDragging: {
      default: false,
    },
    disablePreferences: {
      default: false,
    },
    vertical: {
      default: false,
    },
    disableRouterView: {
      default: false,
    },
  },
  setup(props, context) {
    const show = ref(false);
    const activeContent = ref("");
    const activeItem = ref(props.activeIndex);
    const container = ref();
    const mainContainer = ref();
    const tabContainerBody = ref();
    const bodyHeight = ref(0);
    let minWidth = 0;

    const preferencesManager = new UserPreferencesManager(
        `tab_container_${props.routerPrefix}`
    );

    if (!props.disablePreferences) {
      watch(preferencesManager.value, () => preFormReordering(), {
        deep: true,
      });
      preferencesManager.get();
    }

    let lastIntroduceActivity = null;
    let childCounter = 0;
    const tabNames = ref([]);
    const route = useRoute();

    /**
     *
     * @type {SimpleDrag}
     */
    let dragInstance = null;

    const goToRoute = (index) => {
      VueInstanceService.router.push({
        name: tabNames.value[index],
        query: route.query,
        params: route.params,
      });
    };

    const setActiveItem = (index) => {
      activeItem.value = index;
      if (props.routerMode) {
        goToRoute(index);
      }
    };

    const selectItems = () => container.value.querySelectorAll(".tab-item-v2");

    const initDragger = () => {
      const items = container.value.querySelectorAll(".tab-item-v2");

      for (let i = 0; i < items.length; i++) {
        items[i].setAttribute("moveable", "moveable");
        items[i].setAttribute("group", "tabs-container");
      }

      Sortable.create(container.value, {
        group: "tabs-container",
        draggable: ".tab-item-v2",
        direction: "horizontal",
        animation: 180,
        onUpdate: () => {
          setTimeout(() => {
            const items = selectItems();
            const newOrder = {};
            for (let i = 0; i < items.length; i++) {
              newOrder[i] = items[i].getAttribute("data-item-name");
            }
            if (!props.disablePreferences) preferencesManager.set(newOrder);
          });
        },
      });

      // dragInstance.findElements();
      // dragInstance.addMouseEvents();
    };

    const introduce = (tabName) => {
      clearTimeout(lastIntroduceActivity);
      lastIntroduceActivity = setTimeout(() => {
        if (!props.disableDragging) initDragger();

        if (!props.disablePreferences) preFormReordering();

        setTimeout(() => {
          updateBodyHeight();
        }, 500);
      }, 500);

      const current = childCounter;

      if (tabName) {
        if (!props.routerMode) tabNames.value.push(tabName);
        else tabNames.value.push(props.routerPrefix + "_" + tabName);
      } else {
        tabNames.value.push(`${props.routerPrefix}_tab_${current}`);
      }

      if (props.routerMode && route.name === tabNames.value[current]) {
        activeItem.value = current;
      }

      childCounter++;

      nextTick(() => {
        updateBodyHeight();
      });

      return {
        current,
        tabName: tabNames.value[current],
      };
    };

    const preFormReordering = () => {
      if (!preferencesManager.value.value) return;

      const tabsList = Object.values(preferencesManager.value.value);
      if (tabsList.length > 0 && container.value) {
        const tabs = selectItems();
        if (tabs.length > 0) {
          const sharedParents = tabs[0].parentElement;
          for (let i = 0; i < tabsList.length; i++) {
            const dataItemName = tabsList[i];
            for (let j = 0; j < tabs.length; j++) {
              const tabElement = tabs[j];
              if (tabElement.getAttribute("data-item-name") === dataItemName)
                sharedParents.append(tabElement);
            }
          }
        }
      }
    };

    const updateBodyHeight = () => {
      const cardBodyParent = findClassInParent(
          tabContainerBody.value,
          "card-body"
      );
      if (!cardBodyParent) return;
      const myStyle = getComputedStyle(tabContainerBody.value);
      const style = getComputedStyle(cardBodyParent);
      const cardBodyHeight = Number(style.height.replace("px", ""));
      const myHeight = Number(myStyle.height.replace("px", ""));
      const extraHeight = cardBodyHeight - myHeight;
      bodyHeight.value = cardBodyHeight - extraHeight - 80;
    };

    const decideOverFlowState = () => {
      if (!props.vertical) {
        mainContainer.value.style.maxWidth = "100%";
        container.value.style.maxWidth = "100%";

        if (innerWidth - 30 < mainContainer.value.scrollWidth) {
          container.value.style.overflowX = 'scroll';
        } else {
          container.value.style.overflowX = 'visible';
        }

      }
    }

    const globalOnScroll = () => {
      decideOverFlowState();
    }

    onMounted(() => {
      updateBodyHeight();
      tabNames.value = [];
      show.value = true;
      window.addEventListener('resize', globalOnScroll);
      nextTick(() => {
        nextTick(() => {
          decideOverFlowState();
        })
      })
    });

    onUnmounted(() => {
      window.removeEventListener('resize', globalOnScroll);
    })

    return {
      // ref
      container,
      mainContainer,
      tabContainerBody,

      // data
      activeContent,
      activeItem,
      bodyHeight,
      tabNames,
      show,

      // function
      setActiveItem,
      introduce,
    };
  },
};
</script>
<style lang="scss">
.tab-items-container {
  &.is-vertical {
    .tab-item-v2 {
      width: 165% !important;
    }
  }
}
</style>
