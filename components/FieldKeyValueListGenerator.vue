<template>
  <div class="row simple-rounded-container">
    <div class="col-12">
      <div class="row align-items-end justify-content-center">
        <div class="col-5">
          <FieldComponent @change.stop
                          name="simple_little_table_key"
                          label="کلید"
                          placeholder="کلید"
                          v-model="key"
          />
        </div>
        <div class="col-5">
          <FieldComponent @change.stop
                          name="simple_little_table_value"
                          label="مقدار"
                          placeholder="مقدار"
                          v-model="value"
          />
        </div>
        <div class="col-2">
          <button type="button" class="btn btn-primary mb-1" @click.stop.prevent="add()">
            اضافه کردن
          </button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <TableV1
          @delete="removeItem($event)"
          ref="tableRef"
          :disable-card="true"
          :conf="tableClass"
          :list="list"
      />
    </div>
  </div>
</template>
<style>
.simple-rounded-container {
  padding-top: 5px;
  margin: 5px !important;
  box-shadow: 0 0 5px #000 inset;
}
</style>
<script lang="ts">
import {Table} from "@/custom/components/table/Table";
import TableV1 from "@/custom/components/table/TableV1.vue";
import FieldComponent from "@/custom/components/FieldComponent.vue";
import {computed, onMounted, Ref, ref, toRef} from "vue";

class LocalSimpleTable extends Table {

  defaultHeaders = [
    'key',
    'value'
  ]

  headerTranslate = {
    key: "کلید",
    value: "مقدار",
  }

  get showContextMenuView() {
    return false;
  }
}

export default {
  components: {FieldComponent, TableV1},
  props: ['name', 'modelValue'],
  emits: ['update:modelValue'],
  setup(props, context) {
    const modelValue = toRef(props, 'modelValue');
    const key = ref('');
    const value = ref('');
    const list: Ref<Array<Record<string, any>>> = ref(modelValue.value ? modelValue.value : []);

    const add = () => {
      const found = list.value.findIndex((item) => item['key'] === key.value) > -1;

      const keyData = key.value.trim();
      const valueData = value.value.trim();

      if (keyData === "" || valueData === "")
        return;

      if (!found) {
        list.value.push({
          key: key.value,
          value: value.value
        });
        key.value = "";
        value.value = ""
      }
      context.emit('update:modelValue', list.value);
    }

    const convertedList = computed(() => {
      context.emit('update:modelValue', list.value);
      return JSON.stringify(list.value);
    })

    const removeItem = (e) => {
      const found = list.value.findIndex((item) => {
        console.log(item['key'] === e['key']);
        return item['key'] === e['key']
      });
      console.log(list.value, e);
      console.log("e['key']",found);
      if (found > -1) {
        list.value.splice(found, 1);
      }
    }


    return {
      // function
      add,
      removeItem,

      key,
      value,
      list,
      convertedList,
      tableClass: LocalSimpleTable
    }
  },
}
</script>