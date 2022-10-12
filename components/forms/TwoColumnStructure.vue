<script lang="ts">
import {defineComponent, h} from "vue";
import TableByModelName from "@/custom/components/forms/TableByModelName.vue";
import AddAbleFormOnline from "@/custom/components/forms/AddAbleFormOnline.vue";
import ShowModelHistoryButton from "@/custom/components/ShowModelHistoryButton.vue";
import {Configs, VueInstanceService} from "@/Defaults";

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
    'formAsModal'
  ],
  emits: ['formRefReady', 'update', 'done', 'cancel', 'view'],
  setup(props, context) {
    let formInstance: any;
    let formRef: any;

    const passModalInstance = (slots: Record<string, any>) => {
      slots = {
        ...slots
      }

      if (slots['modalButton']) {
        slots['toolbar0'] = () => {
          return slots['modalButton']({formRef});
        }
      }

      return slots;
    }

    return () => {

      const table = (!props.disableTable) ? h(TableByModelName, {
        extendClass: props.tableExtendClass,
        onUpdate: (data) => context.emit('update', data, formInstance, formRef),
        onView: (data) => context.emit('view', data, formInstance, formRef),
        title: props.tableCardTitle,
        filterModelName: props.tableModel,
        onSearchParams: props.onTableSearchParams,
      }, {
        'toolbar0': () => Configs['showModelHistoryButton'] ? h(ShowModelHistoryButton, {
          modelName: props.tableModel
        }) : undefined,
        ...passModalInstance(context.slots)
      }) : undefined

      const form = (!props.disableForm) ? h(AddAbleFormOnline, {
        ref: (el) => {
          formRef = el;
          context.emit('formRefReady', el)
        },
        formAsModal: props.formAsModal,
        onCancel: (e, b) => {
          formInstance.resetForm();
          context.emit('cancel', e, b, formRef)
        },
        onDone: (e, b) => {
          VueInstanceService.emit(`${props.tableModel}Table`, ['refresh']);
          formInstance.resetForm();
          context.emit('done', e, b, formRef)
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
                'col-xl-6 col-lg-12 mb-3 mb-xl-0': !props.disableForm && !props.formAsModal,
                'col-xl-12 col-lg-12 mb-3 mb-xl-0': props.disableForm || props.formAsModal,
              },
            }, table,
        ),
        !props.formAsModal ? h('div', {
          class: {
            'col-xl-6 col-lg-12': !props.disableTable,
            'col-xl-12 col-lg-12': props.disableTable,
          },
        }, form) : form
      ]);
    }
  }
})
</script>