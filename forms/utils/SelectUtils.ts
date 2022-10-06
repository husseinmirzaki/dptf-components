import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";

export function buildSelectOption(data) {
    if (data.name)
        return {value: data.id, text: data.name};
    else if (data.full_name)
        return {value: data.id, text: data.full_name};
    else if (data.title)
        return {value: data.id, text: data.title};
    else if (data.first_name)
        return {value: data.id, text: data.first_name + " " + data.last_name};
    else if (data.number)
        return {value: data.id, text: data.number};
}

export function selectFormDataV2(formInstance: any, serverData: any) {
    serverData = Object.assign({}, serverData);
    formInstance.activeFields.value.forEach((e: FieldComponentPropsInterface) => {
        if (e.field_type == "select" && e.select_multiple) {
            if (serverData[e.name]) {
                serverData[e.name] = serverData[e.name].map(buildSelectOption)
            }
        } else if (e.field_type == "select" && !e.select_multiple) {
            if (serverData[e.name]) {
                const serverInfo = serverData[e.name];
                serverData[e.name] = [buildSelectOption(serverInfo)];
            }

        }
    });
    return serverData
}
