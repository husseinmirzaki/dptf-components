<template>
  <div class="tab-item-v2" :class="{active: parent && index == parent.activeItem}" data-kt-stepper-element="nav"
       @click="$emit('change', log(index))">
    <slot>
      <span class="stepper-title">
        {{ title }}
      </span>
    </slot>
  </div>
</template>
<script>
import {onMounted, ref, toRef, watch} from "vue";

export default {
  props: ['title', 'active', 'parent', 'name'],
  setup(props) {
    const index = ref(0);
    const parent = toRef(props, 'parent');

    const log = (_index) => {
      parent.value.setActiveItem(_index);
    }

    onMounted(() => {
      index.value = parent.value.introduce(props.name);
    });

    return {
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
    background-position: 50px -20px ;
  }
  to {
    background-position: 150% -70px;
  }
}

.tab-item-v2 {
  padding: 10px;
  margin: 0 10px;
  font-size: 17px;
  font-weight: bold;
  background-position: 0 0;

  &.is-replace-able {
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

  &.active {
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