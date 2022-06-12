<template>
  <div class="filter-place-holder d-flex align-items-center justify-content-start ps-1" :id="parentId"
       :class="{show: show, active: show || !valueIsEmpty}">
    <i class="fas fa-filter" @click="show=!show"></i>
    <div class="fixed-filter-container" @move.prevent.stop @drag.prevent.stop @mousedown.stop v-if="show">
      <div class="d-flex justify-content-between align-items-center">
        <field-builder :field="$attrs.field"/>
        <div class="condition"  @click="condition+=1;condition > 5 ? condition=0:null;">
          <img src="/media/table/e.png" v-if="condition==0"/>
          <img src="/media/table/not.png" v-if="condition==1"/>
          <img src="/media/table/g.png" v-if="condition==2"/>
          <img src="/media/table/l.png" v-if="condition==3"/>
          <img src="/media/table/el.png" v-if="condition==4"/>
          <img src="/media/table/eg.png" v-if="condition==5"/>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.filter-place-holder {
  opacity: 0;
  top: 0;
  height: 20px;
  width: 20px;
  padding: 0 3px;
  right: 0;
  position: absolute;

  .fixed-filter-container {
    display: none;
    min-width: 250px;
    position: absolute;
    padding: 5px 5px 0 0;
    background-color: #ffffff;
    border: 1px solid #e7e7e7;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    .field  {
      flex-shrink: 1 !important;
    }
  }

  .condition {
    padding: 2px 6px;
    img {
      width: 16px;
      height: 16px;
    }
  }

  &.show, &.active {

    box-shadow: -3px 0 3px rgba(0, 0, 0, 0.2);
    background-color: #0BB7AF;

    > i {
      color: white;
    }

    opacity: 1;

    .fixed-filter-container {
      display: block;
    }
  }
}
</style>
<script>
import FieldBuilder from "@/custom/components/FieldBuilder";
import {computed, ref, watch} from "vue";
import {randomId} from "@/custom/helpers/random";

export default {
  components: {FieldBuilder},
  setup(props, context) {
    const show = ref(false);
    const valueIsEmpty = ref(true);
    const parentId = `id_${randomId(2)}`;
    const condition = ref(0);
    context.attrs.field.options.modal_id = `#${parentId}`;

    const key = context.attrs.field.options['v-model-key'];
    watch(context.attrs.field.options['v-model'], (newValue, oldValue) => {
      valueIsEmpty.value = newValue[key] === undefined || !newValue[key].length || newValue[key].length <= 0;
    }, {
      deep: true
    })

    return {
      condition,
      valueIsEmpty,
      parentId,
      show,
    }
  }
}
</script>