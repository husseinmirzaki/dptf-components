import {ApiService} from "@/Defaults";
import {Ref} from "vue";
import InfiniteScrollItem from "@/custom/components/InfiniteScrollItem.vue";

export class InfiniteScrollContainerConf {
    get service(): typeof ApiService | undefined {
        return undefined;
    }

    get list(): Ref<Array<any>> | Array<any> | undefined {
        return undefined;
    }

    get filters(): Ref<Record<string, any>> | Record<string, any> | undefined {
        return undefined;
    }

    get itemComponent(): any {
        return InfiniteScrollItem;
    }
    toText(item): string {
        return String(item.id);
    }
}