import {Ref} from "vue";

export default interface FieldComponentPropsInterface {
    defaultInputClasses?: string;
    select_filter_id?: string;
    select_filter_key?: string;
    col_class?: string;
    one_line_field_classes?: string;
    one_line_label_classes?: string;
    modelValue?: Ref;
    field_id?: string;
    one_line?: boolean;
    show_errors?: boolean;
    name: string;
    required?: boolean;
    select_multiple?: boolean;
    multiple?: boolean;
    select_tag?: boolean;
    read_only?: boolean;
    label?: string;
    field_type?: string;
    file_accept?: string;
    placeholder?: string;
    select_url?: string;
    modal_id?: string;
    select_options?: object;
    validation?: Record<string, any>;
    select_data?: Array<Record<string, any>>;
    "v-model"?: Ref;
    "v-model-key"?: string;
    "update:modelValue"?: (event) => void;
    outerAccess?: (elementRef) => void;
    excludeOnModes?: Array<string>,
    onlyOnModes?: Array<string>,
}
export default class FieldComponentProps implements FieldComponentPropsInterface {
}