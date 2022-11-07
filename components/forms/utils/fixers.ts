import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";
import { modelToServiceMap } from "@/ModelToServiceMap";

export function fixFieldSelectUrl(f: FieldComponentPropsInterface) {
  if (f.field_type == "select" && f["rel_model"]) {
    f.select_url = modelToServiceMap[f["rel_model"]].selectUrl;
  }
}

export function fieldFieldSelect(
  field: FieldComponentPropsInterface,
  onDone: any = undefined
) {
  if (field["rel_model"] && !field["select_url"]) {
    if (modelToServiceMap[field["rel_model"]]) {
      field["select_url"] = modelToServiceMap[field["rel_model"]].selectUrl;
      if (onDone) field = onDone(field);
    } else console.warn("Add required service for", field["rel_model"]);
  }
  return field;
}
