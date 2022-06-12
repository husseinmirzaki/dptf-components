<template>
  <div class="position-relative float-start" style="height: 20px;width:20px;margin-left: -20px">
    <div class="filter-place-holder d-flex align-items-center justify-content-start ps-1"
         :class="{show: show, active: show || !valueIsEmpty}" ref="root">
      <i class="fas fa-filter" @click="toggle()"></i>
      <div class="fixed-filter-container"
           ref="filterContainer"
           @move.prevent.stop @drag.prevent.stop
           @mousedown.stop :class="{'d-none':!show}" :id="parentId">
        <div class="d-flex flex-column justify-content-between align-items-center">
          <field-builder :field="$attrs.field"/>
          <button class="btn btn-success btn-sm" @click="clearField($attrs.field)">پاک شود</button>
          <!--        <div class="condition"  @click="condition+=1;condition > 5 ? condition=0:null;">-->
          <!--          <img src="/media/table/e.png" v-if="condition==0"/>-->
          <!--          <img src="/media/table/not.png" v-if="condition==1"/>-->
          <!--          <img src="/media/table/g.png" v-if="condition==2"/>-->
          <!--          <img src="/media/table/l.png" v-if="condition==3"/>-->
          <!--          <img src="/media/table/el.png" v-if="condition==4"/>-->
          <!--          <img src="/media/table/eg.png" v-if="condition==5"/>-->
          <!--        </div>-->
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
    position: fixed;
    padding: 5px 5px;
    background-color: #ffffff;
    border: 1px solid #e7e7e7;
    transform: translateX(-50%);

    .field {
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
import {computed, onMounted, ref, watch} from "vue";
import {randomId} from "@/custom/helpers/random";

export default {
  components: {FieldBuilder},
  setup(props, context) {
    const root = ref();
    const filterContainer = ref();
    const show = ref(false);
    const key = context.attrs.field.options['v-model-key'];
    console.log(!!context.attrs.field.options['v-model'][key])
    const valueIsEmpty = ref(!context.attrs.field.options['v-model'][key]);
    const parentId = `id_${randomId(2)}`;
    const condition = ref(0);
    context.attrs.field.options.modal_id = `#${parentId}`;
    watch(context.attrs.field.options['v-model'], (newValue, oldValue) => {
      valueIsEmpty.value = newValue[key] === undefined || !newValue[key].length || newValue[key].length <= 0;
    }, {
      deep: true
    })

    const toggle = () => {
      show.value = !show.value;
      const boundingClientRect = root.value.getBoundingClientRect();
      filterContainer.value.style.left = boundingClientRect.left + 'px';
      filterContainer.value.style.top = (boundingClientRect.height + boundingClientRect.top) + 'px';
    }

    const clearField = (field) => {
      console.log("field", field);
    }

    return {
      clearField,
      toggle,
      condition,
      valueIsEmpty,
      parentId,
      show,
      root,
      filterContainer,
    }
  }
}
</script>