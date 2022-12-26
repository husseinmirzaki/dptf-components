<template>
  <div class="table-v1-options-in-header">

    <Button class="btn btn-sm btn-icon"
            :class="{active: exportIsOpen}"
            ref="refExportButton" @click="toggleExportButton">
      <inline-svg src="media/icons/light/file-arrow-down.svg" width="15px" height="15px"/>
    </Button>
    <Button class="btn btn-sm btn-icon"
            :class="{active: filterIsOpen}"
            @click="filterIsOpen=!filterIsOpen;$emit('showRowFilter', filterIsOpen);">
      <inline-svg src="media/icons/light/filter.svg" width="15px" height="15px"/>
    </Button>
    <Button class="btn btn-sm btn-icon"
            :class="{active: orderIsOpen}"
            ref="refOrderButton" @click="toggleOrderButton">
      <inline-svg src="media/icons/light/arrow-down-wide-short.svg" width="15px" height="15px"/>
    </Button>
    <div class="body-containers" @change.stop @update.stop>
      <TableV1OptionsInHeaderOrder ref="refOrderV2Container"/>
    </div>

  </div>
</template>
<script lang="ts" setup>
import {isRef, onMounted, ref} from "vue";
import TableV1OptionsInHeaderOrder from "@/custom/components/table/TableV1OptionsInHeaderOrder.vue";

const animationDuration = 175;
const refExportButton = ref();
const refOrderButton = ref();

const orderIsOpen = ref(false);
const filterIsOpen = ref(false);
const exportIsOpen = ref(false);

const goToButton = (containerRef, buttonRef) => {
  const buttonBB = buttonRef.value.getBoundingClientRect();
  let e: any;
  if (isRef(containerRef)) e = containerRef.value;
  else e = containerRef;
  e.style.top = `${buttonBB.top + buttonBB.height}px`;
  e.style.left = `${buttonBB.left}px`;
}

const toggleOrderButton = (event: MouseEvent) => {

  const container = refOrderV2Container.value.toggle();
  if (container)
    goToButton(container, refOrderButton);
}

const toggleExportButton = () => {
  //
}

let timeoutClose: any;

const refOrderV2Container = ref();
const openOrderContainer = () => {
  refOrderV2Container.value.classList.add('d-block', 'open');
  orderIsOpen.value = true;
}

const closeOrderContainer = () => {
  refOrderV2Container.value.classList.remove('open');
  refOrderV2Container.value.classList.add('close-animation');
  timeoutClose = setTimeout(() => {
    refOrderV2Container.value.classList.remove('d-block', 'close-animation');
    orderIsOpen.value = false;
  }, animationDuration);
}

onMounted(() => {
  document.documentElement.style.setProperty("--filter-v2-open-close-animation-duration", animationDuration + "ms");
});


</script>
<style lang="scss">
.table-v1-options-in-header {
  .body-containers {
    position: relative;

    .table-v1-order-v2 {
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

  > button {
    &.active {
      background: #6a6a6a;

      svg {
        fill: white;
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