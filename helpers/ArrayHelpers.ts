export function copyRecordData<T = any>(record: T): T {
  const copyHere: Record<string, any> = {};
  Object.keys(record).forEach((currentKeyInLoop) => {
    copyHere[currentKeyInLoop] = record[currentKeyInLoop];
  });

  return copyHere as T;
}

export function removeArrayElement(arrayList: Array<any>, element: any) {
  const indexOfElement = arrayList.indexOf(element);
  const elementExists = indexOfElement > -1;
  if (elementExists) {
    arrayList.splice(indexOfElement, 1);
  }
}

export function removeArrayElements(
  arrayList: Array<any>,
  elements: Array<any>
) {
  elements.forEach((currentLoopElement) => {
    removeArrayElement(arrayList, currentLoopElement);
  });
}

function buildFormData(formData, data, parentKey?) {
  if (
    data &&
    typeof data === 'object' &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach((key) => {
      const isKeyNumber = !isNaN(Number(key));
      buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      );
    });
  } else {
    const value = data == null ? '' : data;
    console.log(parentKey, value);
    formData.append(parentKey, value);
  }
}

export function jsonToFormData(data) {
  const formData = new FormData();

  buildFormData(formData, data);

  return formData;
}

export function obj2FormData(obj) {
  const formData = new FormData();

  const createFormData = (obj, subKeyStr = '') => {
    for (const i in obj) {
      const value = obj[i];
      const subKeyStrTrans = subKeyStr ? subKeyStr + '[' + i + ']' : i;

      if (typeof value === 'string' || typeof value === 'number') {
        formData.append(subKeyStrTrans, String(value));
      } else if (typeof value === 'object') {
        createFormData(value, subKeyStrTrans);
      }
    }
  };

  createFormData(obj);

  return formData;
}
