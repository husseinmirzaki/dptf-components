import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";

export function selectFormDataV2(formInstance: any, serverData: any) {
    serverData = Object.assign({}, serverData);
    formInstance.activeFields.value.forEach((e: FieldComponentPropsInterface) => {
        if (e.field_type == "select" && e.select_multiple) {
            if (serverData[e.name]) {
                serverData[e.name] = serverData[e.name].map((serverInfo) => {
                    if (serverInfo.name)
                        return {value: serverInfo.id, text: serverInfo.name};
                    else if (serverInfo.full_name)
                        return {value: serverInfo.id, text: serverInfo.full_name};
                    else if (serverInfo.title)
                        return {value: serverInfo.id, text: serverInfo.title};
                    else if (serverInfo.first_name)
                        return {value: serverInfo.id, text: serverInfo.first_name + " " + serverInfo.last_name};
                    else if (serverInfo.number)
                        return {value: serverInfo.id, text: serverInfo.number};
                })
            }
        } else if (e.field_type == "select" && !e.select_multiple) {

            if (serverData[e.name]) {
                const serverInfo = serverData[e.name];
                if (serverInfo.name)
                    serverData[e.name] = [{value: serverInfo.id, text: serverInfo.name}];
                else if (serverInfo.full_name)
                    return {value: serverInfo.id, text: serverInfo.full_name};
                else if (serverInfo.title)
                    serverData[e.name] = [{value: serverInfo.id, text: serverInfo.title}];
                else if (serverInfo.first_name)
                    serverData[e.name] = [{
                        value: serverInfo.id,
                        text: serverInfo.first_name + " " + serverInfo.last_name
                    }];
                else if (serverInfo.number)
                    serverData[e.name] = [{value: serverInfo.id, text: serverInfo.number}];
            }

        }
    });
    return serverData
}
