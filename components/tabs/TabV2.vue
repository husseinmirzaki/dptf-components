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
.tab-item-v2 {
  padding: 10px;
  margin: 0 10px;
  font-size: 17px;
  font-weight: bold;
}

.active {
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
</style>