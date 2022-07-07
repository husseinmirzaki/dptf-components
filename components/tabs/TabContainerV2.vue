<template>
  <div class="d-flex justify-content-center align-items-center" ref="container">
    <slot name="tabs" v-if="show" :setActiveItem="setActiveItem"/>
  </div>
  <div class="d-flex justify-content-center align-items-center w-100 h-100 pb-7">
    <router-view v-if="routerMode"/>
    <slot v-else :name="tabNames[activeItem]"/>
  </div>
</template>
<script>
import {onMounted, ref, watch} from "vue";
import {VueInstanceService} from "@/Defaults";
import {SimpleDrag} from "@/custom/components/table/TableDrag";
import {UserPreferencesManager, UserPreferencesV2Api} from "@/custom/services/UserPreferencesV2Api";

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

    onMounted(() => {
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

      // data
      activeContent,
      activeItem,
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