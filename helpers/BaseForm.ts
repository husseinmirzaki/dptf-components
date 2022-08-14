import {computed, ComputedRef, nextTick, ref, Ref, UnwrapRef, watch} from "vue";
import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";
import {onkeys} from "@/custom/helpers/CustomFunctions";
import * as Yup from 'yup';

export interface CreateFormExtend<T extends CreateForm, E = any> {
    update: any;
    formButtonsInstance: any;
    formContainer: any;
    activeSchema: any;
    activeFields: any;
    obj: Ref<E>;
    formInstance: T;
}

export interface FieldsInterface {
    id?: string | undefined | null
}

/**
 * CreateForm is a class which is used to define a basic
 * structure of a form. This basic structure contains
 * required field, validations and possible field styling.
 * also, this class is responsible for processing validated
 * data and preparing it for sending.
 *
 * This class also is able to have multiple different mods
 * which means it will let form to have multiple possible
 * ways to validation form data so, we can have a mode in
 * which username is required and another mode in which
 * username is required. (todo)
 */
export class CreateForm<T extends FieldsInterface = any> {
    /**
     * hold id which points to some data on database of server. it is used for
     * updating current form data on database
     */
    id: string | number | null = null;

    /**
     * this specific form class modes
     * this option will specify which modes should be generated
     * and then which fields should be excluded from that specific
     * mode
     *
     * users can still use validation property to override this
     * rule for one or more field
     */
    get modes(): Array<string> {
        return this.getModes();
    }

    getModes(): Array<string> {
        return ['basic'];
    }

    activeMode: Ref<string> = ref('basic');

    get theActiveMode() {
        return this.activeMode.value;
    }

    set theActiveMode(mode) {

        if (mode == '') {
            this.theActiveMode = 'basic';
            return;
        }

        if (this.activeMode.value != mode)
            this.activeMode.value = mode;
    }

    /**
     * an instance or a class which extends ApiService
     */
    service: any = null;

    /**
     * current fields of the form
     * @deprecated try to use `modeFields` from now on
     */
    fields: Array<FieldComponentPropsInterface> = [];

    /**
     * raw fields
     */
    rawFields: any = [];

    /**
     * these are generated fields base on the modes, user
     * provides to this class
     */
    modeFields: Record<string, Array<FieldComponentPropsInterface>> = {};

    /**
     * holds all validation schemas which are used by
     * current form. The key is mode and value is an
     * object of Schema which is used by vee-validation
     */
    validationSchemas: Record<string, any> = {};

    /**
     * holds current data of all possible modes.The key
     * is mode and value is an object in which key is
     * field name and value is field vue `ref` data
     * basic: {
     *     username: Ref('any possible data')
     * }
     */
    refs: Record<string, Ref<T>> = {};

    /**
     * holds a reference to all fields in current form
     * references are of type `FieldComponent` or any
     * custom component which user may have injected
     * to form through `concatFields` method
     */
    elementRefs: Record<keyof T, any> = {} as Record<keyof T, any>;

    /**
     * whether submit function must be treated as an
     * object creation form (create) or object
     * modification form (update)
     */
    isUpdate = ref<boolean>(false);

    /**
     * returns a class which must contain specific methods
     * these methods are `create` and `update` at the moment
     */
    getService(): any {
        return null;
    }

    /**
     * return a field `input` `document` object by its field name
     * @param name
     */
    getDByName(name) {
        return this.elementRefs[name].root.value;
    }

    /**
     * returns a vee `Field` instance
     * @param name
     */
    getDByField(name: keyof T) {
        return this.elementRefs[name].fieldRef.value;
    }

    /**
     * sets id of basic mode
     * @param id
     */
    getSetDataById(id, mode = 'basic') {
        this.refs[mode].value['id'] = id;
    }

    /**
     * returns an array which could be used in form
     * `concatFields` method
     *
     * flattens an object of key/value to an array of
     * [key, value].
     * @param option
     */
    optionToSelect2Option(option: Record<string, any>, selectedValue: null | string = null) {
        const extracted: Array<Array<any>> = [];
        Object.keys(option).forEach((key) => {

            extracted.push([key, option[key], selectedValue && option[key] == selectedValue]);

        });
        return extracted;
    }

    private filterMode(searchMode: string) {

        return (eMode: string) => {
            const eModeContainsSearchMode = eMode.startsWith(searchMode) && eMode.split('-').length <= searchMode.split('-').length;
            const searchModeContainsEMode = searchMode.startsWith(eMode) && searchMode.split('-').length >= eMode.split('-').length;
            return eModeContainsSearchMode || searchModeContainsEMode;
        }
    }


    constructor(rawFields: null | Array<FieldComponentPropsInterface> = null) {

        this.rawFields = rawFields;

        // first get current service instance or class
        this.service = this.getService();

        this.processFields();
        // console.log("current form modes", this.modes);
        // prepare fields and create an object which will
        // be used to access FieldComponent component dome
        // from with in form class

    }

    processFields() {
        this.concatFields().forEach((e) => {
            e.outerAccess = (e1) => {
                this.elementRefs[e.name] = e1;
            }

            // TODO: remove this one
            this.fields.push(e);

            this.modes.forEach((mode) => {

                if (e.onlyOnModes && e.onlyOnModes.findIndex(this.filterMode(mode)) == -1) return;
                if (e.excludeOnModes && e.excludeOnModes.findIndex(this.filterMode(mode)) > -1) return;

                if (!this.modeFields[mode]) this.modeFields[mode] = [];

                this.modeFields[mode].push(e);

            });
        });
        // create required validation schemas
        const validationSchemas = this.concatValidationSchemas();
        // set generated validation schema of each mode
        // to this.validationSchemas
        Object.keys(validationSchemas).forEach((e) => {
            this.validationSchemas[e] = validationSchemas[e];
        });
    }

    /**
     * this will extract all file<Blob> from fields which
     * can hold file
     * @param mode the mode we are trying to find files in
     */
    extractFiles(mode = 'basic') {
        const files: Array<any> = [];
        // files are found using field_type and file length
        // parameter
        // to do so we will first get all field name
        // and then using that field name we will check
        // whether that field's that hold possible file
        // object or not
        Object.keys(this.refs[mode].value).forEach((e1) => {
            const field = this.fields.find((e) => e.name == e1);
            if (field && field.field_type === 'file')
                if (this.refs[mode].value[e1] && this.refs[mode].value[e1].length) {
                    for (let i = 0; i < this.refs[mode].value[e1].length; i++) {
                        files.push({
                            file: this.refs[mode].value[e1][i] as any,
                            field: this.fields.find((field) => field.name == e1)
                        });
                    }
                }
        })

        return files;
    }

    /**
     * Extracts all files which are in a specific mode
     * in case we expect any of the files to be multiple
     * selection of files we should pass field name in
     * is array parameter
     * @param mode
     * @param is_array
     */
    extractFilesToSend(mode = 'basic', is_array: Array<string> = []) {
        const files: Record<string, Array<any>> = {};
        // Get fields of a specific mode and finds
        // possible file and then set those found
        // Array<File> or File to a key in files

        Object.keys(this.refs[mode].value).forEach((e1) => {
            if (this.refs[mode].value[e1] instanceof FileList) {
                for (let i = 0; i < this.refs[mode].value[e1].length; i++) {
                    const field = this.fields.find((field) => field.name == e1);
                    if (field) {
                        if (!files[field.name] && is_array.indexOf(field.name) > -1)
                            files[field.name] = [];
                        if (is_array.indexOf(field.name) > -1)
                            files[field.name].push(this.refs[mode].value[e1][i] as any);
                        else
                            files[field.name] = this.refs[mode].value[e1][i] as any
                    }
                }
            }
        })
        return files;
    }

    /**
     * sets a reference for a mode
     * @param reference vue Ref object
     * @param mode mode
     */
    addR(reference: Ref, mode = "basic") {
        this.refs[mode] = reference;
    }

    /**
     * unsets a reference from a mode
     * @param mode
     */
    delR(mode: string) {
        delete this.refs[mode];
    }

    /**
     * Override this to add ur fields to class
     * this method is called before creating
     * validation schemas
     */
    concatFields(): Array<FieldComponentPropsInterface> {
        if (typeof this.rawFields == 'string')
            return JSON.parse(this.rawFields);
        return this.rawFields;
    }

    /**
     * Generates all the required validation schemas
     * it also lets developers have customized
     * validation schemas for each field if they don't
     * want to generate them manually
     */
    concatValidationSchemas(): Record<string, any> {
        /**
         * This object is returned as result
         */
        const fieldsValidations = {};

        /**
         * adds a mode to fieldsValidations
         * @param b
         */
        const addBase = (b = 'basic') => {
            if (!fieldsValidations[b]) {
                fieldsValidations[b] = {};
            }
        }

        addBase();
        this.modes.forEach((mode) => {
            addBase(mode);
        });

        // here we are trying to create a validation
        // schema for each field
        // to do so we should loop over fields and check
        // if user has already declared a  validation key
        // if they did it means that they have custom
        // validation otherwise we should generate it
        // automatically.
        // ---- GENERATING AUTOMATICALLY ----
        // when we are generating validation automatically
        // we should find a text as label and pay attention
        // to field type in some cases we should use a
        // different kind of validation schema for example
        // for select element we may have a case where
        // input will return an object or an array in which
        // we should use a different kind of validation
        // schema
        this.fields.forEach((e) => {
            if (e.field_type == "separator")
                return;

            const d = e['validation'];
            if (d) {
                // console.log("custom validations", d);
                if (Array.isArray(d)) {
                    d.forEach((validation) => {
                        fieldsValidations['basic'][e.name] = validation;
                    });
                } else {
                    Object.keys(d).forEach((modeName) => {
                        fieldsValidations[modeName][e.name] = d[modeName];
                    })
                }
            } else {
                // which modes will be excluded when using validation
                // schema
                const excludeModes = e.excludeOnModes;
                const addValidationToModes = (field, validation) => {
                    this.modes.forEach((mode) => {
                        if (e.onlyOnModes && e.onlyOnModes.findIndex(this.filterMode(mode)) == -1) return;
                        if (excludeModes && excludeModes
                            .findIndex(this.filterMode(mode)) > -1) return;
                        fieldsValidations[mode][field] = validation;
                    })
                }

                const fieldType = e['field_type'];
                const label = e['label'];
                const placeholder = e['placeholder'];
                // this text is shown in errors
                const text = label || placeholder;
                const required = e['required'] === undefined || e['required'];

                if (text) {
                    if (fieldType == "select") {
                        const multipleSelected = e['select_multiple'];
                        if (multipleSelected && required) {
                            // selects with multiple attribute return array
                            // so, we should use an array validation schema
                            addValidationToModes(e.name, Yup.array().nullable()['checkSelect']('حداقل یکی از موارد را انتخاب کنید').label(text));
                        } else if (required) {
                            // if select doesn't have a multiple attribute
                            addValidationToModes(e.name, Yup.string().nullable()['checkSingleSelect']('حداقل یکی از موارد را انتخاب کنید').label(text));
                        }
                    } else if (fieldType == "file" && required) {
                        // file filedType returns an Object
                        // as output, so we should use mixed
                        // validation schema for it
                        addValidationToModes(e.name, Yup.mixed().required().label(text));
                    } else if (fieldType == "number" && required) {
                        // we expect number fieldType to return
                        // a number so number validation schema
                        // is used
                        addValidationToModes(e.name, Yup.number().required().label(text));
                    } else {
                        // strings can be anything so, we will only check
                        // for any condition only if field is required
                        if (required) {
                            addValidationToModes(e.name, Yup.string().required().label(text));
                        }
                    }
                }
            }
        });

        // here we are turning all those objects
        // to actual validation schemas
        Object.keys(fieldsValidations).forEach((key) => {
            // to create validation schema we use below function
            //                       ▼▼▼          ▼▼▼▼▼
            fieldsValidations[key] = Yup.object().shape(fieldsValidations[key]);
        });
        return fieldsValidations;
    }

    /**
     * will set v-model and v-model-key on fields
     * this two keys will let fields to put their
     * data in one Object reactively
     * @param key the which data must be set to reactively
     * @param ref the ref which key must be searched in
     * @param name the key which data will use
     */
    setKeyRef(key: string, ref = "basic", name: string | null = null) {
        this.fields.forEach((e) => {
            if ((!name && key == e.name) || e.name == name) {
                e["v-model"] = this.refs[ref];
                e["v-model-key"] = key;
            }
        });
        Object.keys(this.modeFields).forEach((fieldsKey) => {
            this.modeFields[fieldsKey].forEach((fieldComponent) => {
                if ((!name && key == fieldComponent.name) || fieldComponent.name == name) {
                    fieldComponent["v-model"] = this.refs[ref];
                    fieldComponent["v-model-key"] = key;
                }
            });
        })
    }

    /**
     * automatically will connect fields to a ref
     */
    autoAddRef() {
        this.modes.forEach((mode) => {
            // this is not using currently generated
            // fields
            this.concatFields().forEach((e) => {
                // if (e.onlyOnModes && e.onlyOnModes.findIndex(this.filterMode(mode)) == -1) return;
                // if (e.excludeOnModes && e.excludeOnModes.findIndex(this.filterMode(mode)) > -1) return;
                this.setKeyRef(e.name, mode);
            });
        });
    }

    /**
     * should validate and generate a data which
     * developers can use to send data to server
     *
     * submit will return FormData or JsonObject
     * only of `isCustom` is set to `true`
     *
     * submit function itself can send create or
     * update request but to do so we should
     * provide the getService the right class
     * the class must contain a `create` and `update`
     * method which we will use here
     *
     * create method must accept JsonObject
     * or FormData as input `(data: any)`
     * update method must accept an id and
     * a JsonObject or FormData as input
     * `(id:number, data: any)`
     *
     * in case `id` property of form class is set
     * and `update` property of form class is set
     * to `true` submit function will try to set
     * an update request to server otherwise a
     * create request is sent
     *
     * @param event is not required
     * @param isCustom will return data
     */
    submit(event, isCustom = false, onDone = null) {
        let promise;
        // to determine whether we should return a FormData
        // or JsonObject we should first know if user selected
        // any files
        // if any file is selected then it means that we should
        // use FormData otherwise a JsonObject is used
        if (this.extractFiles().length > 0) {
            // in case we need to Return FormData
            // we should know which field is an
            // array to do so we use multiple
            // attribute and select_multiple
            // attribute
            const isArray: Array<string> = [];
            const formData = new FormData();
            // we are extracting files two time
            // I don't know why its happening but
            // it sims like it's not required
            this.modeFields[this.activeMode.value].forEach((e) => {

                if (e.multiple) {
                    isArray.push(e.name);
                }
                // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
                if (e.field_type !== 'file') {
                    if (e.select_multiple) {
                        if (this.refs.basic.value[e.name] && this.refs.basic.value[e.name].length)
                            this.refs.basic.value[e.name].forEach((value) => {
                                formData.append(e.name + '[]', value as any)
                            });
                    } else {
                        formData.append(e.name, this.refs.basic.value[e.name])
                    }
                }
            });
            // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
            const files = this.extractFilesToSend('basic', isArray);
            Object.keys(files).forEach((e) => {
                if (files[e].length)
                    for (let i = 0; i < files[e].length; i++) {
                        formData.append(e + '[]', files[e][i]);
                    }
                else
                    formData.append(e, files[e] as any);
            });
            if (isCustom) {
                return formData;
            }
            if (this.isUpdate.value)
                promise = this.service.updateOne(
                    this.refs[this.activeMode.value].value['id'],
                    formData
                );
            else
                promise = this.service.createOne(formData);
        } else {
            // a JsonObject is returned if `isCustom` is set to `true`
            if (isCustom) {
                return this.refs[this.activeMode.value].value;
            }
            if (this.isUpdate.value)
                promise = this.service.updateOne(
                    this.refs[this.activeMode.value].value['id'],
                    this.refs[this.activeMode.value].value
                );
            else
                promise = this.service.createOne(this.refs[this.activeMode.value].value);
        }
        return promise;
    }

    /**
     * watched on data and tries to catch `id`
     * and will set that to class id
     * @param mode
     */
    watch(mode: string) {
        return watch(
            this.refs[mode],
            () => {
                if (this.refs[mode] && this.refs[mode].value && this.refs[mode].value['id'])
                    this.id = this.refs[mode].value['id']!;
            },
            {deep: true}
        );
    }

    /**
     * prepares a form to be used by its component
     */
    extend(): CreateFormExtend<CreateForm & this, T> {
        // prepare the basic data holder
        const obj = ref<any>({});
        this.modes.forEach((mode) => {
            this.addR(obj, mode);
        });
        this.autoAddRef();
        return {
            // this update can be used on component
            // to know whether ur updating or not
            // set it to `true` it ur updating
            update: this.isUpdate,
            formButtonsInstance: ref<any>({}),
            formContainer: ref<any>({}),
            activeSchema: computed(() => this.validationSchemas[this.activeMode.value]),
            activeFields: computed(() => this.modeFields[this.activeMode.value]),
            obj,
            formInstance: this,
        }
    }

    resetForm(newDefaults: null | Record<string, any> = null) {
        this.activeMode.value = 'basic';
        this.isUpdate.value = false;
        Object.keys(this.refs).forEach((refKey) => {
            // console.log("this.refs[refKey].value", this.refs[refKey].value);
            if (this.refs[refKey].value) {
                this.refs[refKey].value['id'] = null;
                Object.keys(this.refs[refKey].value).forEach((dataKey) => {

                    const field = this.modeFields[this.activeMode.value].find((e) => e.name == dataKey);

                    if (field && field.field_type === 'select') {

                        try {
                            if (field.select_multiple)
                                this.elementRefs[dataKey].select2Instance.value.val([]);
                            else
                                this.elementRefs[dataKey].select2Instance.value.val(null);

                            this.elementRefs[dataKey].select2Instance.value.change();
                        } catch (e) {
                            console.error(e);
                        }
                    }

                    const data = this.refs[refKey].value[dataKey];
                    const _set = (a) => this.refs[refKey].value[dataKey] = a;
                    switch (typeof data) {
                        case "boolean":
                            _set(false);
                            break;
                        case "bigint":
                        case "number":
                            _set(0);
                            break;
                        case "object":
                            _set(null);
                            break;
                        case "string":
                            _set("");
                            break;
                    }
                    nextTick(() => {
                        if (this.elementRefs[dataKey])
                            this.elementRefs[dataKey].showError.value = false;
                    });
                });
            }
        })
        this.refs.basic.value['id'] = null;

        if (newDefaults)
            Object.keys(newDefaults).forEach((key) => {
                this.refs.basic.value[key] = newDefaults[key];
            });
    }

    setValues(data: Record<string, any>) {

        if (data.id) {
            this.refs.basic.value['id'] = data.id;
        }

        Object.keys(data).forEach((e) => {
            try {
                if (this.elementRefs[e])
                    (this.elementRefs[e] as any).setValue(data[e]);
            } catch (e) {
                console.log(e);
            }
        });
    }
}
