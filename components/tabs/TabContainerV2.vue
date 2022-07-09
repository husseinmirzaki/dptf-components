<template>
  <div class="d-flex justify-content-center align-items-center" ref="container">
    <slot name="tabs" v-if="show" :setActiveItem="setActiveItem"/>
  </div>
  <div class="d-flex justify-content-center align-items-center w-100 h-100 pb-7" ref="tabContainerBody">
    <slot name="tab-container" :tabNames="tabNames" :activeItem="activeItem" :routerMode="routerMode"
          :bodyHeight="bodyHeight">
      <router-view v-if="routerMode"/>
      <slot v-else :name="tabNames[activeItem]"/>
    </slot>
  </div>
</template>
<script>
import {nextTick, onMounted, ref, watch} from "vue";
import {VueInstanceService} from "@/Defaults";
import {SimpleDrag} from "@/custom/components/table/TableDrag";
import {UserPreferencesManager} from "@/custom/services/UserPreferencesV2Api";
import {findClassInParent} from "@/custom/helpers/DomHelpers";

export default {
  props: {
    activeIndex: {
      default: 0,
    },
    routerPrefix: {
      default: '',
    },
    routerMode: {
      default: false,
    }
  },
  setup(props, context) {
    const show = ref(false)
    const activeContent = ref('')
    const activeItem = ref(props.activeIndex);
    const container = ref();
    const tabContainerBody = ref();
    const bodyHeight = ref(0);

    const preferencesManager = new UserPreferencesManager(`tab_container_${props.routerPrefix}`);
    watch(preferencesManager.value, () => preFormReordering(), {deep: true});
    preferencesManager.get();


    let lastIntroduceActivity = null;
    let childCounter = 0;
    const tabNames = ref([]);
    const tabsOrder = ref({});

    /**
     *
     * @type {SimpleDrag}
     */
    let dragInstance = null;

    const goToRoute = (index) => {
      VueInstanceService.router.push({
        name: tabNames.value[index],
      })
    }

    const setActiveItem = (index) => {
      activeItem.value = index;
      if (props.routerMode) {
        goToRoute(index);
      }
    }

    const selectItems = () => container.value.querySelectorAll('.tab-item-v2');

    const initDragger = () => {
      const items = container.value.querySelectorAll('.tab-item-v2');

      for (let i = 0; i < items.length; i++) {
        items[i].setAttribute("moveable", "moveable");
        items[i].setAttribute("group", "tabs-container");
      }

      dragInstance.findElements();
      dragInstance.addMouseEvents();
    }

    const introduce = (tabName) => {

      clearTimeout(lastIntroduceActivity);
      lastIntroduceActivity = setTimeout(() => {
        initDragger();
        preFormReordering();
        updateBodyHeight();
      }, 500);

      const current = childCounter;

      if (tabName) {
        tabNames.value.push(props.routerPrefix + "_" + tabName);
      } else {
        tabNames.value.push(`${props.routerPrefix}_tab_${current}`);
      }

      if (props.routerMode && current === 0) {
        goToRoute(current);
      }

      childCounter++;

      nextTick(() => {
        updateBodyHeight();
      })

      return {
        current,
        tabName: tabNames.value[current]
      };
    }

    const preFormReordering = () => {
      const tabsList = Object.values(preferencesManager.value.value);
      if (tabsList.length > 0 && container.value) {
        const tabs = selectItems();
        if (tabs.length > 0) {
          const sharedParents = tabs[0].parentElement;
          for (let i = 0; i < tabsList.length; i++) {
            const dataItemName = tabsList[i]
            console.log(dataItemName);
            for (let j = 0; j < tabs.length; j++) {
              const tabElement = tabs[j];
              if (tabElement.getAttribute('data-item-name') === dataItemName)
                sharedParents.append(tabElement);
            }
          }
        }
      }
    }

    const updateBodyHeight = () => {
      const cardBodyParent = findClassInParent(tabContainerBody.value, 'card-body');
      const style = getComputedStyle(cardBodyParent);
      bodyHeight.value = Number(style.height.replace('px', ''));
    }

    onMounted(() => {
      updateBodyHeight();
      tabNames.value = [];
      show.value = true;
      dragInstance = new SimpleDrag(container.value);
      dragInstance.onItemDropped = (element) => {
        const items = selectItems();
        const newOrder = {};
        for (let i = 0; i < items.length; i++) {
          newOrder[i] = items[i].getAttribute('data-item-name');
        }
        preferencesManager.set(newOrder);
      }
    })

    return {
      // ref
      container,
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
    }
  }
}
</script>
<style lang="scss">
.tab-item {

}
</style>