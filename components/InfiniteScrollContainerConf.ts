import {ApiService, VueInstanceService} from "@/Defaults";
import {nextTick, ref, Ref, watch} from "vue";
import InfiniteScrollItem from "@/custom/components/InfiniteScrollItem.vue";
import {randomId} from "@/custom/helpers/random";

export class InfiniteScrollContainerConf {

    selectedItems: Ref<Array<any>> = ref([]);
    eventEmitter: any;

    private lastFilterCounterTimer: any;
    filterCounter = ref(0);

    constructor() {
        this.eventEmitter = randomId(3);
        watch(this.selectedItems, (e) => {
            VueInstanceService.emit(this.eventEmitter, e);
        }, {deep: true});
    }

    get service(): typeof ApiService | undefined {
        return undefined;
    }

    get list(): Ref<Array<any>> | Array<any> | undefined {
        return undefined;
    }

    get filter(): Ref<Record<string, any>> | Record<string, any> | undefined {
        return undefined;
    }

    get itemComponent(): any {
        return InfiniteScrollItem;
    }

    notifyFilterViews() {
        clearTimeout(this.lastFilterCounterTimer);
        this.lastFilterCounterTimer = setTimeout(() => {
            this.filterCounter.value++;
            nextTick(() => this.filterCounter.value++);
        }, 500);
    }

    filterViews(item: any): boolean {
        return true;
    }

    selectItem(item: any) {
        const indexOf = this.selectedItems.value.findIndex((e) => e.id == item.id);
        if (indexOf == -1) {
            this.selectedItems.value.push(item);
        } else {
            this.selectedItems.value.splice(indexOf, 1);
        }
    }

    isSelected(item: any) {
        if (!item) return false;
        return this.selectedItems.value.findIndex(
            (e) => e.id == item.id
        ) != -1;
    }

    toText(item): string {
        return String(item.id);
    }
}