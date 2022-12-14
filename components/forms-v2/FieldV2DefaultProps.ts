import {PropType} from "vue";
import {randomId} from "@/custom/helpers/random";

export const FieldV2DefaultProps = {
    id: {
        type: String,
        default: () => "field_" + randomId()
    },
    name: String,
    label: String,
    placeholder: String,
    type: Object as PropType<"text" | "number"| "textarea" | "checkbox" | "radio">,
    defaultValue: Object,
};

export const FieldV2DefaultEmits = [
    'data'
];