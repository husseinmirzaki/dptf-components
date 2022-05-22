export function checkKeyRule(
    service: any,
    errorMessage: string,
    identifierCallback: () => string | number | null,
    before: any
) {
    return before["promise"]((instance, value) => {
        return new Promise<boolean>((resolve) => {
            if (!value || value == "") {
                resolve(true);
                return;
            }

            service
                .checkKey(value, identifierCallback())
                .then(({data}) => {
                    resolve(!data["exists"]);
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }, "این واحد تکراری میباشد");
}

/**
 *
 * @param formInstance
 * @param successCallback
 */
export function defaultSubmitBehaviour(formInstance, successCallback: null | ((e) => void) = null) {
    return () => {
        const promise = formInstance.submit()

        promise.then((e) => {

            if (successCallback)
                successCallback(e)

            formInstance.resetForm()
        });

        return promise;
    };
}

export function onkeys(ref: any, onKey: (index, value) => void) {
    Object.keys(ref).forEach(onKey);
}
