export function removeArrayElement(arrayList: Array<any>, element: any) {
    const indexOfElement = arrayList.indexOf(element);
    const elementExists = indexOfElement > -1;
    if (elementExists) {
        arrayList.splice(indexOfElement, 1);
    }
}

export function removeArrayElements(arrayList: Array<any>, elements: Array<any>) {
    elements.forEach((currentLoopElement) => {
        removeArrayElement(arrayList, currentLoopElement);
    });
}