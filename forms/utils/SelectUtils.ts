import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";
import {util} from "prismjs";


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
    else if (data.type_animal)
        return {value: data.id, text: data.type_animal};
    return data;
}

export function selectFormDataV2(formInstance: any, serverData: any) {
    serverData = Object.assign({}, serverData);
    console.log('jigar - serverData', serverData)
    formInstance.activeFields.value.forEach((e: FieldComponentPropsInterface) => {
        console.log('jigar - e', e)
        if (e.field_type == "select" && e.select_multiple) {
            if (serverData[e.name]) {
                serverData[e.name] = serverData[e.name].map(buildSelectOption)
            }
        } else if (e.field_type == "select" && !e.select_multiple) {
            if (serverData[e.name]) {
                const serverInfo = serverData[e.name];
                if (typeof serverInfo == "boolean" || typeof serverInfo == 'string' || typeof serverInfo == 'number')
                    return;
                serverData[e.name] = [buildSelectOption(serverInfo)];
            }

        }
    });
    return serverData
}
