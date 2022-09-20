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
    showLabel?: boolean;
    required?: boolean;
    select_multiple?: boolean;
    multiple?: boolean;
    select_tag?: boolean;
    'show-help'?: string;
    read_only?: boolean | Ref<boolean>;
    label?: string;
    field_type?: string | "text" | "component" | "hidden" | "file" | "select" | "select-v2" | "textarea" | "p-date-time" | "checkbox" | "separator" | "auto-complete" | "currency";
    field_container_classes?: string;
    file_accept?: string;
    placeholder?: string;
    select_url?: string;
    modal_id?: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    select_options?: object;
    selected_component?: any;
    dateTimeType?: "date"|"date-time";
    validation?: Record<string, any>;
    select_data?: Array<Record<string, any>>;
    "v-model"?: Ref;
    "v-model-key"?: string;
    "update:modelValue"?: (event) => void;
    outerAccess?: (elementRef) => void;
    excludeOnModes?: Array<string>;
    onlyOnModes?: Array<string>;
    selectV2Config?: Record<string, any>;
    canAddItem?: boolean;
    onAddClick?: () => void;
    defaultValue?: any;
}

export interface FieldComponentPropsInterfaceNonRequired {
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
    name?: string;
    required?: boolean;
    select_multiple?: boolean;
    multiple?: boolean;
    select_tag?: boolean;
    'show-help'?: string;
    read_only?: boolean;
    label?: string;
    field_type?: string | "text" | "component" | "hidden" | "file" | "select" | "select-v2" | "textarea" | "p-date-time" | "checkbox" | "separator" | "auto-complete" | "currency";
    field_container_classes?: string;
    file_accept?: string;
    placeholder?: string;
    select_url?: string;
    modal_id?: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    select_options?: object;
    selected_component?: any;
    validation?: Record<string, any>;
    select_data?: Array<Record<string, any>>;
    "v-model"?: Ref;
    "v-model-key"?: string;
    "update:modelValue"?: (event) => void;
    outerAccess?: (elementRef) => void;
    excludeOnModes?: Array<string>,
    onlyOnModes?: Array<string>,
    selectV2Config?: Record<string, any>,
    canAddItem?: boolean,
    onAddClick?: () => void,
    defaultValue?: any,
}


export default class FieldComponentProps implements FieldComponentPropsInterface {
}