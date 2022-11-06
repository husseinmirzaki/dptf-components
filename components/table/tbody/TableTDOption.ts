import { defineAsyncComponent } from 'vue';

export function tableTDOption(options) {
  return defineAsyncComponent(
    () =>
      new Promise<any>((resolve) => {
        resolve({
          template: '<td>test</td>',
        });
      })
  );
}
