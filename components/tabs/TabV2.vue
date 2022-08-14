<template>
  <div class="tab-item-v2" :data-item-name="indexUniqueName" :class="{
    active: parent && index == parent.activeItem,
    iconOnly: iconOnly
  }"
       data-kt-stepper-element="nav"
       @click="$emit('change', log(index))">
    <slot>
      <template v-if="iconOnly">
        <div class="d-flex flex-column align-items-center">
          <div class="icon-container" :class="{active: parent && index == parent.activeItem}">
          <span class="svg-icon svg-icon-2x" v-if="svgIcon"
                :class="{'svg-icon-primary': parent && index == parent.activeItem}">
            <inline-svg :src="svgIcon"/>
          </span>
          </div>

          <span class="stepper-title title" v-if="title">
            {{ title }}
          </span>
        </div>
      </template>
      <template v-if="!iconOnly">
        <span class="svg-icon svg-icon-2x" v-if="svgIcon"
              :class="{'svg-icon-primary': parent && index == parent.activeItem}">
          <inline-svg :src="svgIcon"/>
        </span>
        <span class="stepper-title" v-if="title">
        {{ title }}
      </span>
      </template>
    </slot>
  </div>
</template>
<script>
import {onMounted, ref, toRef, watch} from "vue";

export default {
  props: ['title', 'active', 'parent', 'name', 'svgIcon', 'iconOnly'],
  setup(props) {
    const index = ref(0);
    const indexUniqueName = ref('');
    const parent = toRef(props, 'parent');

    const log = (_index) => {
      parent.value.setActiveItem(_index);
    }

    onMounted(() => {
      const introduced = parent.value.introduce(props.name);
      index.value = introduced.current;
      indexUniqueName.value = introduced.tabName;
    });

    return {
      indexUniqueName,
      index,
      log
    }
  }
}
</script>
<style lang="scss">
$active-color: #0d8ddc;
@keyframes backgroundPosition {
  from {
    background-position: 50px -20px;
  }
  to {
    background-position: 150% -70px;
  }
}

.active {
  .title {
    transition: font-size 250ms ease;
    color: black !important;
    font-size: 15px;
  }
}

.title {
  color: #5b5b5b !important;
  font-size: 15px;
}

.icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: #f2f2f2;
  border-radius: 50%;
  transition: background-color 250ms ease;
  margin-bottom: 5px;

  &:after {
    content: '';
    position: absolute;
    top: 4px;
    left: 0;
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #3a86f9;
  }

  span.svg-icon svg {
    width: 35px !important;
    height: 35px !important;
  }
  &.active {
    background-color: #373636;

    svg {
      rect, path {
        fill: #f2f2f2 !important;
      }
    }
  }
}

.tab-item-v2 {
  padding: 10px;
  margin: 0 10px;
  font-size: 17px;
  font-weight: bold;
  background-position: 0 0;

  &.show-animation {
    z-index: 4;
  }

  &.is-replace-able {
    z-index: 4;
    background-repeat: no-repeat;
    background-size: 500px 500px;
    animation-name: backgroundPosition;
    animation-iteration-count: infinite;
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: both;
    margin: 0;
    background-image: linear-gradient(
            -30deg,
            rgba(0, 0, 0, 0) var(--percentage),
            rgba(0, 0, 0, .06) var(--percentage),
            rgba(0, 0, 0, .07) calc(var(--percentage) + 15%),
            rgba(0, 0, 0, .07) calc(var(--percentage) + 15%),
            rgba(0, 0, 0, 0) calc(var(--percentage) + 5%),
            rgba(0, 0, 0, 0));
  }

  &.selected-this-one {
    box-shadow: 0 0 0 5px black !important;
  }

  &.active:not(.iconOnly) {
    position: relative;
    color: $active-color;

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-bottom: 1px solid $active-color;
    }
  }
}
</style>