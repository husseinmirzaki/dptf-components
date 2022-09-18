<script lang="ts">
import {defineComponent, h, onMounted, ref} from "vue";
import Modal from "@/custom/components/model/Modal.vue";
import DataHistoryService from "@/custom/services/DataHistoryService";
import Spinner from "@/custom/components/Spinner.vue";
import {VueInstanceService} from "@/Defaults";
import {BuildByModelName} from "@/metronic_custom/services/utils/BuildByModelName";
import {DEFAULT_COLS} from "@/custom/helpers/RenderFunctionHelpers";
import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";

export default defineComponent({
  setup(props, context) {

    let modalInstance: any = null;
    let lastModelInstance: BuildByModelName | any = null
    const data: any = ref({});
    const promise: any = ref();
    const state: any = ref(0);


    const open = (id) => {
      getItem(id);
      modalInstance.open();
    }

    const getItem = (id) => {
      promise.value = DataHistoryService.get(DataHistoryService.baseUrl + id + '?key=w48f94qw9f84qw9f84qw9f8');
      promise.value.then(({data: info}) => {
        state.value = 0
        data.value = info;
        lastModelInstance = new BuildByModelName(data.value.content_type.model, {
          onFormReady: () => {
            state.value = 1;
          }
        });
        lastModelInstance.getFields();
      });
    }

    onMounted(() => {
      VueInstanceService.on('show-history-info', (e) => {
        open(e);
      });
    });

    const fixSelectData = (field, data) => {
      if (field.name && field.field_type == "select" && !field.select_multiple) {
        const item = field.select_data.find((e) => e[0] == data);
        if (item) {
          return item[1]
        }
      }
      return data
    }

    const valueOrNull = (jsonInfo, field) => {
      if (jsonInfo[field['name']]) {
        return jsonInfo[field['name']]
      }
      return null;
    }

    const old = (jsonInfo, field) => {
      const data = valueOrNull(jsonInfo, field);
      if (data && data['old'] != null && data['old'] != undefined && data['old'] != '') {
        return fixSelectData(field, data['old'])
      }
      return '-'
    }

    const newD = (jsonInfo, field) => {
      const data = valueOrNull(jsonInfo, field);
      if (data && data['new'] != null && data['new'] != undefined && data['new'] != '') {
        return fixSelectData(field, data['new'])
      }
      return '-'
    }

    return () => {

      return h(Modal, {
        modalSizeClass: 'w-1000px mw-1000px',
        modalTitle: "تغییرات انجام شده",
        ref: (el) => modalInstance = el,
        thinFooter: true,
      }, {
        'modal-content': () => h(Spinner, {
          loading: state.value == 0,
        }, () => {
          if (state.value == 0) return;
          return [
            DEFAULT_COLS.row(
                {class: 'row first-row'}, [
                  DEFAULT_COLS.col4(h(
                      'p', "نام فیلد ها",
                  )),
                  DEFAULT_COLS.col4(h(
                      'p', "مقدار قدیمی",
                  )),
                  DEFAULT_COLS.col4(h(
                      'p', "مقدار جدید",
                  )),
                ]
            ),
            lastModelInstance.formInstance.activeFields.value.map((field: FieldComponentPropsInterface) => {
              const jsonInfo = data.value.changed_data;
              return DEFAULT_COLS.row(
                  {class: 'not-first-row row'}, [
                    DEFAULT_COLS.col4(h(
                        'p', field.label,
                    )),
                    DEFAULT_COLS.col4(h(
                        'p', old(jsonInfo, field),
                    )),
                    DEFAULT_COLS.col4(h(
                        'p', newD(jsonInfo, field),
                    )),
                  ]
              )

            }),
          ]
        })
      });
    }
  }
});
</script>
<style lang="scss" scoped>
.first-row {
  text-align: center;
}

.not-first-row {
  padding: 2px;

  p {
    background-color: #fbf2ec;
    margin: 0 !important;
    padding: 5px !important;
  }

  .col-4 {
    padding: 0 3px;
  }

  .col-4:nth-child(n+2) {
    text-align: center;
  }
}
</style>