import {ref, Ref} from "vue";
import {CreateForm, CreateFormExtend} from "@/custom/helpers/BaseForm";
import {modelToServiceMap} from "@/ModelToServiceMap";
import {FieldsApiService} from "@/custom/services/FieldsApiService";

// تمام چیزی که این خط داره انجام میده اینه که به کامپایلر
// میگه که ما یک ورودی میگیریم و هرچیزی رو ممکنه که خروجی بدیم
type OnFieldFunction = (field: any, formInstance: any|undefined) => any

class BuildByModelName {
    formClass: any;
    formInstance: CreateFormExtend<any> | undefined;
    formFound: Ref<boolean> = ref(true);
    formBuilt: Ref<boolean> = ref(false);

    modelName: string;
    overrideOptions: Record<string, any>;

    onModes: OnFieldFunction | undefined;
    onBuildFields: OnFieldFunction | undefined;
    onFields: OnFieldFunction | undefined;
    onOrderField: OnFieldFunction | undefined;

    onBeforeSubmit: OnFieldFunction | undefined;
    onAfterSubmit: OnFieldFunction | undefined;
    onBeforeCreate: OnFieldFunction | undefined;
    onAfterCreate: OnFieldFunction | undefined;
    onBeforeUpdate: OnFieldFunction | undefined;
    onAfterUpdate: OnFieldFunction | undefined;

    isUsingModal: boolean;

    constructor(
        modelName: string,
        options: Record<string, any> = {}
    ) {
        const defaultOptions: Record<string, any> = {
            isUsingModal: false,
        };

        Object.assign(defaultOptions, options);

        this.modelName = modelName;

        this.overrideOptions = defaultOptions['overrideOptions'];
        this.isUsingModal = defaultOptions['isUsingModal'];

        this.onModes = defaultOptions['onModes'];
        this.onBuildFields = defaultOptions['onBuildFields'];
        this.onFields = defaultOptions['onFields'];
        this.onOrderField = defaultOptions['onOrderField'];

        this.onBeforeSubmit = defaultOptions['onBeforeSubmit'];
        this.onAfterSubmit = defaultOptions['onAfterSubmit'];
        this.onBeforeCreate = defaultOptions['onBeforeCreate'];
        this.onAfterCreate = defaultOptions['onAfterCreate'];
        this.onBeforeUpdate = defaultOptions['onBeforeUpdate'];
        this.onAfterUpdate = defaultOptions['onAfterUpdate'];
    }

    getFields(buildExtend=true) {
        const promise = FieldsApiService.getFieldsConfig(this.modelName);

        promise.then(({data}) => {
            this.buildFields(data, buildExtend);
        }, ({response}) => {
            if (response.status >= 400 && response.status < 500) {
                this.formFound.value = false;
            }
        });

        return promise;
    }

    buildFields(data: any, buildExtend = true) {
        let fields: any = data;

        if (this.onBuildFields) {
            fields = this.onBuildFields(data, this)
        }

        fields.map((field) => {

            if (field['field_type'] == "textarea") {
                field['col_class'] = 'col-12';
            } else {
                if (this.isUsingModal)
                    field['col_class'] = 'col-sm-12 col-md-6 col-lg-4 col-xl-4';
                else
                    field['col_class'] = 'col-sm-12 col-md-6 col-lg-4 col-xl-4';
            }

            return field;
        });

        fields.sort((a, b) => a['field_type'] == "textarea" && b['field_type'] == "textarea" ? 0 :
            a['field_type'] == "textarea" && b['field_type'] != "textarea" ? -1 : 1);

        if (this.onFields) {
            fields = fields.map((field) => this.onFields!(field, this));
        }

        if (this.onOrderField) {
            const fieldsMapping: any = {};

            fields.forEach((field) => {
                fieldsMapping[field.name] = field;
            });

            fields = this.onOrderField(fields.map((field) => ({name: field.name, field})), this).map((fieldName) => {
                return fieldsMapping[fieldName];
            })
        }

        const service = modelToServiceMap[this.modelName];

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this;

        class CreateFormExtend extends CreateForm {

            constructor() {
                super(fields);
            }

            get modes(): Array<string> {
                if (_this.onModes) {
                    const onModes1 = _this.onModes(['basic'], this);
                    return onModes1;
                }
                return ['basic'];
            }

            submit(event, isCustom = false, onDone: any = null): any {
                if (_this.onBeforeSubmit) {
                    return (async () => {
                        if (_this.onBeforeSubmit) {
                            await _this.onBeforeSubmit([event, isCustom, onDone], this);
                        }
                        let submit = super.submit(event, isCustom, onDone);
                        if (_this.onAfterSubmit) {
                            submit = _this.onAfterSubmit([submit, event, isCustom,onDone], this);
                        }
                        return submit;
                    })();
                }
                let submit = super.submit(event, isCustom, onDone);
                if (_this.onAfterSubmit) {
                    submit = _this.onAfterSubmit([submit, event, isCustom,onDone], this);
                }
                return submit;
            }

            createD(data: any): any {
                if (_this.onBeforeCreate) {
                    _this.onBeforeCreate(data, this);
                }
                const promise = super.createD(data);
                if (_this.onAfterCreate) {
                    _this.onAfterCreate({
                        promise,
                        data
                    }, this)
                }
                return promise;
            }


            update(id: any, data: any): any {
                if (_this.onBeforeUpdate) {
                    _this.onBeforeUpdate(data, this);
                }
                const promise = super.update(id, data);
                if (_this.onAfterUpdate) {
                    _this.onAfterUpdate({
                        promise,
                        data
                    }, this)
                }
                return promise;
            }

            getService(): any {
                return service;
            }
        }

        this.formClass = CreateFormExtend;
        if (buildExtend)
            this.formInstance = new CreateFormExtend().extend();
        this.formBuilt.value = true;
    }

    setValues(data: any) {
        if (this.formBuilt.value) {
            this.formInstance!.formInstance!.setValues(data);
        }
    }

    resetForm() {
        if (this.formBuilt.value) {
            this.formInstance!.formInstance!.resetForm();
        }
    }
}

export {BuildByModelName}