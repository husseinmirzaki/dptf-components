export function buildEmitter() {

    const _emitTo: any = {};
    const emitTo = (name: string, event: any) => {
        Object.values(_emitTo).forEach((element: any) => {
            element(name, event);
        })
    }
    return {
        emitsTo: _emitTo,
        emitTo,
    }

};