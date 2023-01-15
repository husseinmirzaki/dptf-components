<template>
  <div class="row">
    <div class="col-12">
      <div class="d-flex flex-row field-two-column">
        <div class="w-100">
          <Card body-padding-class="p-2">
            <template #card-content>
              <FieldComponent
                  :emit-on-keyup="true"
                  v-model="filterMain"
                  @update:modelValue.stop
                  placeholder="جستجو"/>
              <InfiniteScrollContainer :conf="inputScroll"/>
            </template>
          </Card>
        </div>
        <div class="move-buttons d-flex flex-column align-items-center justify-content-center px-2">
          <Button class="btn btn-success mt-1 mx-1 btn-sm btn-icon" @click="moveToLeft" :disabled="!enableMoveLeft">
            <inline-svg src="media/icons/light/angles-left.svg" width="20px" height="20px"/>
          </Button>
          <Button class="btn btn-danger mt-1 mx-1 btn-sm btn-icon mt-2" @click="moveToRight"
                  :disabled="!enableMoveRight">
            <inline-svg src="media/icons/light/trash-xmark.svg" width="20px" height="20px"/>
          </Button>
        </div>
        <div class="w-100">
          <Card body-padding-class="p-2">
            <template #card-content>
              <FieldComponent
                  :emit-on-keyup="true"
                  v-model="filterSelected"
                  @update:modelValue.stop
                  placeholder="جستجو"/>
              <InfiniteScrollContainer :conf="selectedScroll"/>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.field-two-column {
  margin: 10px 0;

  .move-buttons {
    svg {
      path, g {
        fill: white;
      }
    }
  }
}
</style>
<script lang="ts">
import Card from "@/custom/components/Card.vue";
import FieldComponent from "@/custom/components/FieldComponent.vue";
import {computed, onMounted, onUnmounted, PropType, ref, watch} from "vue";
import InfiniteScrollContainer from "@/custom/components/InfiniteScrollContainer.vue";
import {InfiniteScrollContainerConf} from "@/custom/components/InfiniteScrollContainerConf";
import {ProvinceApiService} from "@/metronic_custom/services/ProvinceApiService";
import {VueInstanceService} from "@/Defaults";

export default {
  components: {InfiniteScrollContainer, FieldComponent, Card},
  props: {
    inputScrollConf: {
      type: Object as PropType<InfiniteScrollContainerConf>,
    },
    selectedScrollConf: {
      type: Object as PropType<InfiniteScrollContainerConf>,
    },
  },
  setup(props, context) {
    const selectedItemsList = ref([]);
    const filterMain = ref("");
    const filterSelected = ref("");
    const enableMoveLeft = ref(false);
    const enableMoveRight = ref(false);

    class BaseToText extends InfiniteScrollContainerConf {

      toText(item) {
        return item.title;
      }

    }

    class InputScroll extends BaseToText {

      filterViews(item) {
        return selectedItemsList.value.findIndex((e) => e["id"] === item.props.data["id"]) === -1;
      }

      get service() {
        return ProvinceApiService;
      }

      get filter() {
        return computed(() => ({
          search: filterMain.value
        }));
      }
    }

    class SelectedScroll extends BaseToText {

      filterViews(item) {
        if (filterSelected.value === "")
          return true;
        return item.props.data.title.search(filterSelected.value) > -1;
      }

      get list() {
        return selectedItemsList;
      }

    }

    const inputScroll = props.inputScrollConf ? props.inputScrollConf : new InputScroll();
    const selectedScroll = props.selectedScrollConf ? props.selectedScrollConf : new SelectedScroll();

    const onInputScrollSelected = () => {
      enableMoveLeft.value = inputScroll.selectedItems.value.length > 0;
    };
    const onSelectedScrollSelected = () => {
      enableMoveRight.value = selectedScroll.selectedItems.value.length > 0;
    };

    const moveToLeft = () => {
      selectedItemsList.value = Object.assign([], inputScroll.selectedItems.value);
      inputScroll.selectedItems.value = [];
      inputScroll.notifyFilterViews();
      context.emit("update:modelValue", Object.assign([], selectedItemsList.value));
    }

    const moveToRight = () => {
      selectedScroll.selectedItems.value.forEach((item) => {
        const indexOf = selectedItemsList.value.findIndex((selectedItem) => {
          return selectedItem["id"] === item.id;
        });
        if (indexOf > -1) {
          selectedItemsList.value.splice(indexOf, 1);
        }
      });
      selectedScroll.selectedItems.value = [];
      inputScroll.notifyFilterViews();
      context.emit("update:modelValue", Object.assign([], selectedItemsList.value));
    }

    let filterSelectedTimer;
    onMounted(() => {
      watch(filterSelected, () => {
        clearTimeout(filterSelectedTimer);
        filterSelectedTimer = setTimeout(() => {
          selectedScroll.notifyFilterViews();
        }, 300);
      });
      VueInstanceService.on(inputScroll.eventEmitter, onInputScrollSelected);
      VueInstanceService.on(selectedScroll.eventEmitter, onSelectedScrollSelected);
    });
    onUnmounted(() => {
      VueInstanceService.off(inputScroll.eventEmitter, onInputScrollSelected);
      VueInstanceService.off(selectedScroll.eventEmitter, onSelectedScrollSelected);
    })

    return {
      filterMain,
      filterSelected,
      inputScroll,
      selectedScroll,
      enableMoveLeft,
      enableMoveRight,
      moveToLeft,
      moveToRight,
    }
  }
}
</script>