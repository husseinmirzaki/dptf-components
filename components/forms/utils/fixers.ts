import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";
import {modelToServiceMap} from "@/ModelToServiceMap";

export function fixFieldSelectUrl(f: FieldComponentPropsInterface) {

    if (f.field_type == "select" && f['rel_model']) {
        f.select_url = modelToServiceMap[f['rel_model']].selectUrl
    }

}