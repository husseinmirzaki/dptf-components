<template>
  <Card>
    <template #card-content>
      <div style="height: 450px; width: 100%" class="d-flex align-items-center justify-content-center"
           v-if="!formBuilt">
        <template v-if="formFound">
          درحال اجرا
          <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
        </template>
        <div class="d-flex flex-column justify-content-center align-items-center text-center" v-else>
          <span class="svg-icon svg-icon-danger">
            <inline-svg src="media/icons/duotune/arrows/arr061.svg" style="width: 150px; height: 150px"/>
          </span>
          <h4>
            متاسفانه فرم موردنظر پیدا نشد <br/>
            ویا شما به فرم موردنظر دسترسی ندارید
          </h4>
        </div>
      </div>
      <template v-if="formBuilt">
        <FormContainer
            :validation-schema="buildByModelName.formInstance.activeSchema"
            ref="form"
        >
          <FormBuilder :fields="buildByModelName.formInstance.activeFields"/>
        </FormContainer>
        <slot name="multiForm"/>
      </template>

      <div class="d-flex">
        <PromiseButton
            text="ثبت"
            v-if="$attrs['disable-card']"
            @submitDone="$emit('done')"
            @clicked="onBeforeSendC(() => {$event($refs.form, buildByModelName.formInstance)})"/>
        <button class="btn btn-danger ms-2" @click="$emit('cancel')" v-if="showCancelButton && $attrs['disable-card']">لغو</button>
      </div>

    </template>
    <template #card-footer v-if="formBuilt">
      <PromiseButton
          text="ثبت"
          @submitDone="$emit('done', $event)"
          @clicked="onBeforeSendC(() => {$event($refs.form, buildByModelName.formInstance)})"/>
      <button class="btn btn-danger ms-2" @click="$emit('cancel')" v-if="showCancelButton">لغو</button>
    </template>
  </Card>
</template>
<script lang="ts">
import {nextTick, watch} from "vue";
import Card from "@/custom/components/Card.vue";
import FormBuilder from "@/custom/components/FormBuilder.vue";
import FormContainer from "@/custom/components/FormContainer.vue";
import PromiseButton from "@/custom/components/PromiseButton.vue";
import {BuildByModelName} from "@/custom/forms/utils/BuildByModelName";

export default {
  components: {Card, PromiseButton, FormContainer, FormBuilder},
  props: [
      'modelName', 'overrideOptions', 'showCancelButton',
    'onBuildFields', 'onFields', 'onOrderField', 'onFormReady',
    'onBeforeSend', 'onModes','onBeforeSubmit', 'onAfterSubmit'
  ],
  setup(props, context) {

    const onUpdate = (data) => {
      buildByModelName.formInstance!.formInstance.fields.forEach((field) => {
        if (field['is_json_field']) {
          const value = data[field['name']];
          if (value == "") {
            delete data[field['name']];
          } else {
            // data[field['name']] = {
            //   "text": data[field['name']]
            // }
          }
        }
      });
    };

    const buildByModelName = new BuildByModelName(
        props.modelName,
        {
          overrideOptions: props.overrideOptions,
          onModes: props.onModes,
          onFields: props.onFields,
          onOrderField: props.onOrderField,
          onBuildFields: props.onBuildFields,
          onBeforeSubmit: props.onBeforeSubmit,
          onAfterSubmit: props.onAfterSubmit,
          onBeforeUpdate: onUpdate,
          onBeforeCreate: onUpdate,
        }
    );

    watch(buildByModelName.formBuilt, (e) => {
      if (e && props.onFormReady) {
        props.onFormReady(buildByModelName);
      }
      nextTick(() => {
        if (!buildByModelName.formInstance!.obj.value['id']) {
          buildByModelName.formInstance!.formInstance.fields.forEach((field) => {
            if (field.default !== undefined) {
              const s: any = {};
              s[field.name] = field.default;
              buildByModelName.formInstance!.formInstance.setValues(s);
            }
          });
        }
      });
    });

    buildByModelName.getFields();

    const onBeforeSendC = (e) => {

      console.log("console.log", e);

      buildByModelName.formInstance!.formInstance.fields.forEach((field) => {
        if (field['is_json_field']) {
          const value = buildByModelName.formInstance!.obj[field['name']];
          if (value && value == "") {
            buildByModelName.formInstance!.obj[field['name']] = null;
          }
        }
      });

      if (props.onBeforeSend) {
        props.onBeforeSend(buildByModelName);
      }

      e();
    }

    return {
      formFound: buildByModelName.formFound,
      formBuilt: buildByModelName.formBuilt,
      buildByModelName,
      onBeforeSendC,
    }
  }
}
</script>