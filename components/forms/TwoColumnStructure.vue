<script lang="ts">
import {defineComponent, h} from "vue";
import TableByModelName from "@/custom/components/forms/TableByModelName.vue";
import AddAbleFormOnline from "@/custom/components/forms/AddAbleFormOnline.vue";
import ShowModelHistoryButton from "@/custom/components/ShowModelHistoryButton.vue";
import {VueInstanceService} from "@/Defaults";

export default defineComponent({
  props: [
    'tableExtendClass',
    'tableCardTitle',
    'formCardTitle',
    'tableModel',
    'onTableSearchParams',
    'formModel',
    'onFormModalField',
    'onFormField',
    'onFormFormReady',
    'onModalFormReady',
    'onFormBuildFields',
    'onModalBuildFields',
    'onFormFieldsOrder',
    'onModalFieldsOrder',
    'disableTable',
    'disableForm',
  ],
  emits: ['formRefReady', 'update', 'done', 'cancel', 'view'],
  setup(props, context) {
    let formInstance: any;
    return () => {

      const table = (!props.disableTable) ? h(TableByModelName, {
        extendClass: props.tableExtendClass,
        onUpdate: (data) => context.emit('update', data, formInstance),
        onView: (data) => context.emit('view', data, formInstance),
        title: props.tableCardTitle,
        filterModelName: props.tableModel,
        onSearchParams: props.onTableSearchParams,
      }, {
        'toolbar0': () => h(ShowModelHistoryButton, {
          modelName: props.tableModel
        }),
      }) : undefined

      const form = (!props.disableForm) ? h(AddAbleFormOnline, {
        ref: (el) => context.emit('formRefReady', el),
        onCancel: (e, b) => {
          formInstance.resetForm();
          context.emit('cancel', e, b)
        },
        onDone: (e, b) => {
          VueInstanceService.emit(`${props.tableModel}Table`, ['refresh']);
          formInstance.resetForm();
          context.emit('done', e, b)
        },
        onBuildFields: props.onFormBuildFields,
        cardTitle: props.formCardTitle,
        onFields: props.onFormField,
        onFormModalField: props.onFormModalField,
        onModalBuildFields: props.onModalBuildFields,
        modelName: props.formModel,
        onFormReady: (e) => {
          formInstance = e;
          if (props.onFormFormReady)
            props.onFormFormReady(e);
        },
        onModalFormReady: props.onModalFormReady,
        onModalOrderField: props.onModalFieldsOrder,
        onOrderField: props.onFormFieldsOrder,
      }) : undefined

      return h('div', {
        class: 'row p-0 m-0'
      }, [
        h('div', {
              class: {
                'col-xl-6 col-lg-12 mb-3 mb-xl-0': !props.disableForm,
                'col-xl-12 col-lg-12 mb-3 mb-xl-0': props.disableForm,
              },
            }, table,
        ),
        h('div', {
          class: {
            'col-xl-6 col-lg-12': !props.disableTable,
            'col-xl-12 col-lg-12': props.disableTable,
          },
        }, form)
      ]);
    }
  }
})
</script>