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
import {onMounted, ref} from "vue";
import {VueInstanceService} from "@/Defaults";
import {SimpleDrag} from "@/custom/components/table/TableDrag";

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


    let lastIntroduceActivity = null;
    let childCounter = 0;
    let tabNames = ref([]);

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

    const initDragger = () => {
      const items = container.value.querySelectorAll('.tab-item-v2');

      for (let i = 0; i < items.length; i++) {
        items[i].setAttribute("moveable", "moveable");
        items[i].setAttribute("group", "container");
      }

      dragInstance.findElements();
      dragInstance.addMouseEvents();
    }

    const introduce = (tabName) => {

      clearTimeout(lastIntroduceActivity);
      lastIntroduceActivity = setTimeout(() => {
        initDragger();
      }, 500);

      const current = childCounter;

      if (tabName) {
        tabNames.value.push(tabName);
      } else {
        tabNames.value.push(`${props.routerPrefix}_tab_${current}`);
      }

      if (props.routerMode && current === 0) {
        goToRoute(current);
      }

      childCounter++;
      return current;
    }

    onMounted(() => {
      tabNames.value = [];
      show.value = true;
      dragInstance = new SimpleDrag(container.value);
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