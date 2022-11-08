import { Ref, ref } from "vue";

export class DragService {
  public static currentDragEvent: DragEvent;
  public static currentItem: Ref<any> = ref(null);

  public static init() {
    document.addEventListener("dragstart", (e) => {
      this.currentDragEvent = e;
      this.currentItem.value = e.target;
    });
  }
}
