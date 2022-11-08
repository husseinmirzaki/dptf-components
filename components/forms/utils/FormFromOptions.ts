import FieldComponentProps, {
  FieldComponentPropsInterfaceNonRequired,
} from "@/custom/components/FieldComponentPropsInterface";
import { modelToServiceMap } from "@/ModelToServiceMap";

export function formFromOptions(
  options: Record<string, any>,
  extra_options: Record<string, FieldComponentPropsInterfaceNonRequired>,
  debug = false
) {
  const built = Object.keys(options)
    .filter((key: any) => {
      return key.search(/(id)|(created_at)|(updated_at)|(deleted_at)/) == -1;
    })
    .map((key: any) => {
      const d = options[key];
      d["name"] = key;

      // d['placeholder'] = d['label'];
      if (debug) {
        d["label"] += " - " + d["name"];
      }
      d["col_class"] = "col-xl-4 col-lg-4 col-md-6 col-sm-12 mt-2";
      switch (d["type"]) {
        case "integer":
          d.field_type = "number";
        case "string":
          d.field_type = "text";
          break;
        case "choice":
          d.field_type = "select";
          d.select_data = d.choices.map((s) => {
            return [s.value, s.display_name];
          });
          break;
        case "field":
          d.canAddItem = true;
          d.field_type = "select";
          break;
      }

      delete d["type"];
      delete d["read_only"];

      if (d["field_type"] == "select") delete d["placeholder"];

      if (extra_options && extra_options[key]) {
        Object.keys(extra_options[key]).forEach((extra_option) => {
          d[extra_option] = extra_options[key][extra_option];
        });
      }

      if (d["rel_model"] && !d["select_url"]) {
        if (modelToServiceMap[d["rel_model"]])
          d["select_url"] = modelToServiceMap[d["rel_model"]].selectUrl;
        else console.log("Add required service for", d["rel_model"]);
      }
      return d;
    });

  // built.sort((a,b) => a.label.length > 50 ? -1 : 1);
  // built.sort((a,b) => a.label.length > 40 ? 1 : -1);

  built.map((a) => {
    // if (a.label.length > 40) {
    //     a['col_class'] = 'col-xl-4 col-lg-4 col-md-6 col-sm-12'
    // }
    // if (a.label.length > 50) {
    //     a['col_class'] = 'col-xl-6 col-lg-6 col-md-6 col-sm-12'
    // }
    return a;
  });
  return built;
}
