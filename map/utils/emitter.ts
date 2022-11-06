export function buildEmitter() {
  const _emitTo: any = {};
  const emitTo = (name: string, event: any) => {
    if (_emitTo.length == 0) return;
    Object.values(_emitTo).forEach((element: any) => {
      element(name, event);
    });
  };
  return {
    emitsTo: _emitTo,
    emitTo,
  };
}
