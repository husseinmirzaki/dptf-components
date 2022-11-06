import { Ref, ref } from 'vue';

export class ContextMenuItem {
  icon?: string;
  faIcon?: string;
  svgIcon?: {
    spanClass?: any;
    src?: string;
  };
  text?: string;
  onClick?: (e) => void;
  state?: 'primary' | 'success' | 'secondary' | 'danger' | 'info' | 'warning';
}

export class ContextMenuService {
  public static clickData: any = null;
  public static items: Ref<Array<any>> = ref([]);

  public static set(items: Array<any>) {
    this.items.value.splice(0, this.items.value.length);
    this.items.value.push(...items);
  }
}
