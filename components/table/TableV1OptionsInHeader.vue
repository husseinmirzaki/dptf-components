<template>
  <Button class="btn btn-sm btn-icon" ref="refExportButton" @click="toggleExportButton">
    <inline-svg src="media/icons/light/file-arrow-down.svg" width="15px" height="15px"/>
  </Button>
  <Button class="btn btn-sm btn-icon" ref="refFilterButton" @click="toggleFilterButton">
    <inline-svg src="media/icons/light/filter.svg" width="15px" height="15px"/>
  </Button>
  <div class="body-containers" @change.stop @update.stop>
    <div class="table-v1-filter-v2" ref="refFilterV2Container">
      <div class="input-filter">
        <FieldComponent
            placeholder="نام فیلد"
            input_class="form-control-sm"
            col_class="w-100"
            v-model="dVisibleItemsFilter"
        />
        <Button class="btn btn-primary mt-1 mx-1 btn-sm btn-icon" ref="refExportButton" @click="toggleExportButton">
          <inline-svg src="media/icons/light/file-arrow-down.svg" width="15px" height="15px"/>
        </Button>
      </div>
      <div class="items">
        <div class="item"
             :class="{active: item == 4}"
             v-for="item in 10" :key="item">
          <div class="anchor">
            <inline-svg src="media/icons/light/grip-dots-vertical.svg"/>
          </div>
          <div class="text">
            متنی که باید نمایش داده شود
          </div>
          <div class="check">
            <FieldComponent
                field_type="checkbox"
                col_class=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import Sortable from "sortablejs";
import FieldComponent from "@/custom/components/FieldComponent.vue";

const animationDuration = 175;
const refExportButton = ref();
const refFilterButton = ref();
const refFilterV2Container = ref();
const dVisibleItemsFilter = ref('');

const goToButton = (containerRef, buttonRef) => {
  const buttonBB = buttonRef.value.getBoundingClientRect();
  const e = containerRef.value;
  e.style.top = `${buttonBB.top + buttonBB.height}px`;
  e.style.left = `${buttonBB.left + buttonBB.width}px`;
}

const toggleFilterButton = (event: MouseEvent) => {
  goToButton(refFilterV2Container, refFilterButton);
}

const toggleExportButton = () => {
  //
}

const openOrderContainer = () => {
  refFilterV2Container.value.classList.add('d-block', 'open');
}

const closeOrderContainer = () => {
  refFilterV2Container.value.classList.remove('open');
  refFilterV2Container.value.classList.add('close-animation');
  setTimeout(() => {
    refFilterV2Container.value.classList.remove('d-block', 'close-animation');
  }, animationDuration);
}

onMounted(() => {
  document.documentElement.style.setProperty("--filter-v2-open-close-animation-duration", animationDuration + "ms");
  goToButton(refFilterV2Container, refFilterButton);
  const filterContainerItems = refFilterV2Container.value.querySelector('.items');
  Sortable.create(filterContainerItems, {
    // group: defaultConfig.tableName,
    draggable: ".item",
    handle: ".anchor",
    direction: "vertical",
    animation: 180,
    onUpdate: () => {
      setTimeout(() => {
        // const l: Array<string> = [];
        // const items = filtersRef.querySelectorAll("input[name]");
        // for (let i = 0; i < items.length; i++) {
        //   l.push(items[i].getAttribute("name"));
        // }
        // changedHeaders.value.splice(0);
        // changedHeaders.value.push(...l);
        // defaultConfig.defaultHeaders = l;
        // saveTableSettings();
      });
    },
  });
  setTimeout(() => {
    openOrderContainer();
  }, 1000);
  setTimeout(() => {
    closeOrderContainer();
  }, 3000);
});


</script>
<style lang="scss">
.body-containers {
  position: relative;

  .table-v1-filter-v2 {
    display: none;
    min-width: 300px;
    background: #F3F6F9;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    padding: 3px;
    box-shadow: 0 0 2px black;

    &.open {
      animation: open-animation var(--filter-v2-open-close-animation-duration) ease-in-out;
    }

    &.close-animation {
      animation: close-animation var(--filter-v2-open-close-animation-duration) ease-in-out;
      opacity: 0;
    }

    .input-filter {
      display: flex;
      flex-direction: row;
    }

    .items {
      display: flex;
      flex-direction: column;

      .item {
        cursor: default;
        height: 30px;
        margin: 1px 3px;
        background: white;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-shadow: -1px 1px 1px -1px black;

        &.srotable-ghost {
          opacity: .5;
        }

        &.sortable-chosen {
          background: #d3edc7;
          box-shadow: -1px 1px 1px -1px #333b02,
          -1px 1px 1px -1px #333b02,
          -1px 1px 1px -1px #333b02,
          -1px 1px 1px -1px #333b02,
          -1px 1px 1px -1px #333b02;

          .anchor {
            background: #333b02;

            svg {
              g, path {
                fill: white;
              }
            }
          }
        }

        .anchor {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eae8e8;
          width: 22px;
          height: 22px;
          margin-right: 3px;
          box-shadow: -1px 1px 1px -1px #000000;

          svg {
            width: 20px;
            height: 20px;
          }
        }

        .text {
          width: 100%;
          flex-grow: 1;
          margin-right: 3px;
        }

        .check {
          margin-top: 3px;
          margin-left: 3px;

          .form-check {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      }
    }
  }
}

@keyframes open-animation {
  from {
    transform: translateY(10px) translateX(10px) scale(.98);
    opacity: 0;
  }
  to {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes close-animation {
  from {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(-10px) translateX(-10px) scale(1.02);
    opacity: 0;
  }
}
</style>