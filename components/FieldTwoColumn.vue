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
                  placeholder="جستجو"/>
              <InfiniteScrollContainer :conf="inputScroll"/>
            </template>
          </Card>
        </div>
        <div class="move-buttons d-flex flex-column align-items-center justify-content-center px-2">
          <Button class="btn btn-success mt-1 mx-1 btn-sm btn-icon" @click="moveToLeft" :disabled="!enableMoveLeft">
            <inlineSvg src="media/icons/light/angles-left.svg" width="20px" height="20px"/>
          </Button>
          <Button class="btn btn-danger mt-1 mx-1 btn-sm btn-icon mt-2" @click="moveToRight"
                  :disabled="!enableMoveRight">
            <InlineSvg src="media/icons/light/trash-xmark.svg" width="20px" height="20px"/>
          </Button>
        </div>
        <div class="w-100">
          <Card body-padding-class="p-2">
            <template #card-content>
              <FieldComponent
                  :emit-on-keyup="true"
                  v-model="filterSelected"
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
import {computed, onMounted, onUnmounted, PropType, Ref, ref, watch} from "vue";
import InfiniteScrollContainer from "@/custom/components/InfiniteScrollContainer.vue";
import {InfiniteScrollContainerConf} from "@/custom/components/InfiniteScrollContainerConf";
import {VueInstanceService} from "@/Defaults";
import InlineSvg from "vue-inline-svg";

export class BaseToText extends InfiniteScrollContainerConf {

  toText(item) {
    return item.title;
  }

}

export function fieldTwoColumnInput(selectedItemsList: Ref<Array<any>>, filterMain: Ref<string>, filterSelected: Ref<string>) {
  class InputScroll extends BaseToText {
    filterViews(item) {
      return selectedItemsList.value.findIndex((e) => e["id"] === item.props.data["id"]) === -1;
    }

    get filter() {
      return computed(() => ({
        search: filterMain.value
      }));
    }
  }

  return InputScroll;
}

export function fieldTwoColumnSelected(selectedItemsList: Ref<Array<any>>, filterMain: Ref<string>, filterSelected: Ref<string>) {
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

  return SelectedScroll;
}


export default {
  components: {InlineSvg, InfiniteScrollContainer, FieldComponent, Card},
  emits: ['builtInputScroll', 'builtSelectedScroll','update:modelValue'],
  props: {
    buildInputScroll: {
      type: Object as PropType<(selectedItemsList: Ref<Array<any>>, filterMain: Ref<string>, filterSelected: Ref<string>) => typeof InfiniteScrollContainerConf>,
      default: () => fieldTwoColumnInput,
    },
    buildSelectedScroll: {
      type: Object as PropType<(selectedItemsList: Ref<Array<any>>, filterMain: Ref<string>, filterSelected: Ref<string>) => typeof InfiniteScrollContainerConf>,
      default: () => fieldTwoColumnSelected,
    },
  },
  setup(props, context) {
    const selectedItemsList: Ref<Array<any>> = ref([]);
    const filterMain = ref("");
    const filterSelected = ref("");
    const enableMoveLeft = ref(false);
    const enableMoveRight = ref(false);

    const InputScroll = props.buildInputScroll(selectedItemsList, filterMain, filterSelected);
    const SelectedScroll = props.buildSelectedScroll(selectedItemsList, filterMain, filterSelected);

    const inputScroll = new InputScroll();
    const selectedScroll = new SelectedScroll();

    context.emit("builtInputScroll", inputScroll);
    context.emit("builtSelectedScroll", selectedScroll);

    const setData = (e) => {
      console.log("setting data", e);
      selectedItemsList.value = e;
    }

    const resetData = (e) => {
      selectedItemsList.value = [];
    }

    const onInputScrollSelected = () => {
      enableMoveLeft.value = inputScroll.selectedItems.value.length > 0;
    };

    const onSelectedScrollSelected = () => {
      enableMoveRight.value = selectedScroll.selectedItems.value.length > 0;
    };

    const moveToLeft = () => {
      const selected = Object.assign([], inputScroll.selectedItems.value);
      selected.forEach((e) => selectedItemsList.value.push(e));
      inputScroll.selectedItems.value = [];
      inputScroll.notifyFilterViews();
      selectedScroll.updateModelValue(context, selectedItemsList.value);
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
      selectedScroll.updateModelValue(context, selectedItemsList.value);
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
      setData,
      resetData,
      moveToLeft,
      moveToRight,
    }
  }
}
</script>
