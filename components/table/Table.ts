import TableHeader from "@/custom/components/table/header/TableHeader.vue";
import TableTH from "@/custom/components/table/thead/TableTH.vue";
import TableTD from "@/custom/components/table/tbody/TableTD.vue";
import {Ref, ref, toRefs, watch} from "vue";
import {ApiService, Configs, VueInstanceService} from "@/Defaults";
import TableTDUser from "@/custom/components/table/tbody/TableTDUser.vue";
import TableTDUserMulti from "@/custom/components/table/tbody/TableTDUserMulti.vue";
import TableTDEmpty from "@/custom/components/table/tbody/TableTDEmpty.vue";
import {ContextMenuItem} from "@/custom/components/ContextMenuService";
import TableTDBool from "@/custom/components/table/tbody/TableTDBool.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import {fieldC} from "@/custom/components/FieldComponent.vue";
import TableTDDateTime from "@/custom/components/table/tbody/TableTDDateTime.vue";
import TableTDColor from "@/custom/components/table/tbody/TableTDColor.vue";
import TableTr from "@/custom/components/table/TableTr.vue";
import TableTDDate from "@/custom/components/table/tbody/TableTDDate.vue";
import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";

export class Table {
    defaultTableName = '';

    get modelName() {
        return '';
    }

    get tableName() {
        return this.defaultTableName;
    }

    get checkAble() {
        return false;
    }

    getFilterForm(): any {
        return {
            obj: ref({}),
        };
    }

    _fieldsCache: any = {};

    getFieldByName(name: string) {
        if (this._fieldsCache[name])
            return this._fieldsCache[name];
        if (!this.filterForm || !this.filterForm.formInstance)
            return;
        const field = this.filterForm.formInstance.fields.find((e) => e.name === name);
        this._fieldsCache[name] = fieldC(field);
        return this._fieldsCache[name];
    }

    /**
     * Default header component which is used
     * anywhere we don't know the data type or
     * header type
     */
    headerComponent = TableHeader;

    /**
     * Default table header component for each
     * individual header item this is used to
     * show data in table <th> tags
     */
    tHeadComponent = TableTH;

    headerVisibility = {};

    /**
     * Default table data component for each
     * individual data item this is used to
     * show data in table <td> tags
     */
    tBodyComponent = TableTD;

    /**
     * Default table data component for each
     * individual data item this is used to
     * show data in table <td> tags
     */
    tBodyRowComponent = TableTr;

    /**
     * a key value object to determine which
     * data should use what component to be
     * shown on table
     */
    tBodyComponents: Record<number, any> = {}

    /**
     * translates each header
     */
    headerTranslate: Record<number, any> = {}

    // isOption: Record<number, any> = {}

    /**
     * properties of the <TableV1/> element component
     */
    props: Record<string, any> = {};

    /**
     * context of the <TableV1/> element component
     */
    context: Record<string, any> = {};

    /**
     * you can define new headers or limit headers
     */
    defaultHeaders: Array<string> = [];

    /**
     * you can define new headers or limit headers
     */
    filterForm: any = {};

    jsonFilters: any = {};

    orderedField: any = ref({});
    filteredHeaders: any = ref([]);

    addJsonFilter(key, data) {
        if (!this.jsonFilters[key]) {
            this.jsonFilters[key] = [];
        } else {
            this.jsonFilters[key].push(data);
        }
    }

    applyFilter(key, filters) {
        this.jsonFilters[key] = filters;
        Object.keys(this.jsonFilters).forEach((key) => {
            const index = this.filteredHeaders.value.indexOf(key);
            if (this.jsonFilters[key] && Array.isArray(this.jsonFilters[key]) && this.jsonFilters[key].length > 0) {
                if (index == -1) {
                    this.filteredHeaders.value.push(key);
                }
            } else {
                if (index > -1) {
                    this.filteredHeaders.value.splice(index, 1);
                }
            }
        });
    }

    /**
     * define context menu items to be shown to users
     * when context menu is requested
     */
    contextMenuItems: Array<ContextMenuItem> = [];

    /**
     * defines the communication method with
     * the server
     */
    method = 'get';

    /**
     * I DONT KNOW YET
     */
    extra: Record<string, any> = {};

    /**
     * Filters
     */
    filters: Ref<Record<string, any>> = ref({});

    /**
     * is table loading ?!
     */
    isLoading: Ref<boolean> = ref(false);

    basePushAddress = '';

    showPagination = true;

    get showActionButtons() {
        return Configs.showTableActionButtons;
    }

    get showContextMenuView() {
        return true;
    }

    get showContextMenuUpdate() {
        return true;
    }

    get showContextMenuDelete() {
        return true;
    }

    get service(): any {
        return null;
    }

    viewPushAddress(data) {
        return this.basePushAddress + data.id;
    }

    updatePushAddress(data) {
        return this.basePushAddress + 'update/' + data.id;
    }

    getDeleteItemId(data) {
        // console.log(data);
        return data.id;
    }

    onDeleteClicked(data) {
        Swal.fire({
            icon: 'warning',
            title: 'آیا تمایل داید که این داده را حذف کنید',
            text: 'توجه کنید بعد از حذف کردن این مورد دیگر قادر به بازگردانی داده های موجود در آن نمیباشید',
            showCancelButton: true,
            confirmButtonText: 'حذف شود',
            cancelButtonText: `حدف نشود`,
            confirmButtonColor: '#F00',
            cancelButtonColor: '#0742c0',
        }).then((e) => {
            if (this.props.url.value != "") {
                if (e.value) {
                    this.service.deleteOne(this.getDeleteItemId(data)).then(() => {
                        this.onDataDeleted(data)
                    });
                }
            } else {
                this.context.emit('delete', data);
            }

        });
    }

    onDataDeleted(data) {
        this.refresh();
        this.context.emit('delete', data);
    }

    onViewClicked(data) {
        if (this.basePushAddress != "") {
            VueInstanceService.router.push(this.viewPushAddress(data));
        } else {
            this.context.emit('view', data);
        }
    }

    onEditClicked(data) {
        if (this.basePushAddress != "") {
            VueInstanceService.router.push(this.updatePushAddress(data));
        } else {
            this.context.emit('update', data);
        }
    }

    onTableEvent(e) {
        //
    }

    constructor(props, context, extra) {
        this.props = toRefs(props);
        this.context = context;
        this.extra = extra;
        this.defaultTableName = this.constructor.name;
        this.contextMenuItems = this.buildContextMenu();
        this.filterForm = this.getFilterForm();
        VueInstanceService.on(this.tableName, (e) => {
            // console.log("called an event for table", this.tableName, e);
            if (e[0] == 'refresh') {
                this.refresh();
            } else {
                this.onTableEvent(e)
            }
        });
        if (this.filterForm) {
            watch(this.filterForm.obj, () => {
                this.refresh();
            }, {
                deep: true,
            })
        }
    }

    get deleteContextMenuText() {
        return "حذف";
    }

    get updateContextMenuText() {
        return "ویرایش";
    }

    get viewContextMenuText() {
        return "نمایش";
    }

    buildContextMenu(): Array<ContextMenuItem> {
        const items: Array<ContextMenuItem> = [];

        if (this.showContextMenuView) {
            items.push({
                state: "primary",
                text: this.viewContextMenuText,
                onClick: (data) => {
                    this.onViewClicked(data);
                }
            });
        }

        if (this.showContextMenuUpdate) {
            items.push({
                state: "warning",
                text: this.updateContextMenuText,
                onClick: (data) => {
                    this.onEditClicked(data);
                }
            });
        }

        if (this.showContextMenuDelete) {
            items.push({
                state: "danger",
                text: this.deleteContextMenuText,
                onClick: (data) => {
                    this.onDeleteClicked(data);
                }
            });
        }

        return items;
    }

    headers(list) {
        if (this.defaultHeaders.length > 0)
            return this.defaultHeaders;

        if (list && list.length > 0) {
            this.defaultHeaders = Object.keys(list[0]);
            return this.defaultHeaders;
        }

        return [];
    }

    get menuEnabled() {
        return true;
    }

    get menuItems() {
        return null;
    }

    get menuTitle() {
        return null;
    }

    get menuProps() {
        const props = {};
        if (this.menuTitle)
            props['title'] = this.menuTitle;
        if (this.menuItems)
            props['items'] = this.menuItems;
        return props;
    }

    onHeaderProps() {
        return {
            title: this.props.title.value,
            description: this.props.description.value
        };
    }

    onHeaderComponent() {
        return this.headerComponent;
    }

    onTHeadProps(header, index) {

        let translate = '';
        if (this.headerTranslate[header]) {
            translate = this.headerTranslate[header];
        } else {
            translate = VueInstanceService.vue.config.globalProperties['$t'](`table_${header}`);
        }

        if (header == 'table-action') {
            translate = 'عملیات';
        }

        return {
            class: {
                'ps-3': index === 0,
            },
            header: translate,
        };
    }

    onTHeadComponent(header, index) {
        return this.tHeadComponent;
    }

    onTBodyRowBinds(item, index): any {
        return {};
    }

    onTBodyRowComponent(item, index): any {
        return this.tBodyRowComponent;
    }

    onTBodyProps(item, header, index, rowIndex: string | number | undefined = undefined): any {
        let itemElement = Object.assign(item);
        if (header.search('.') > -1) {
            const s = header.split('.');
            for (const i in s) {
                if (itemElement[s[i]]) {
                    itemElement = itemElement[s[i]]
                } else {
                    itemElement = null;
                    break;
                }
            }
        } else {
            itemElement = item[header];
        }

        // if (this.isOption[header]) {
        //     if (this.isOption[header][item[header]] !== undefined || this.isOption[header][item[header]] !== null) {
        //         itemElement = this.isOption[header][item[header]];
        //     } else
        //         itemElement = '-';
        // }

        return {
            data: itemElement,
        };
    }

    onTBodyComponent(item, header, index, rowIndex: string | number | undefined = undefined) {

        if (this.tBodyComponents[header]) {
            return this.tBodyComponents[header];
        }

        const data = item[header];
        if (data != null) {
            if (typeof data === 'boolean') {
                return TableTDBool;
            } else if (typeof data === 'string') {
                if (data.startsWith("#") && data.length === 7)
                    return TableTDColor;
                if (data === "true" || data == "false")
                    return TableTDBool;
                else if (data.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
                    return TableTDDate;
                }
                // matches the json iso formatted datetime
                else if ((data.endsWith('Z') && data.search(/[:\-T]{2,}/) > -1) || data.split(/[:\-T]/).length > 2) {
                    return TableTDDateTime;
                }
            } else if (typeof data === 'object') {
                if (Array.isArray(data) && data.length > 0) {
                    if (data[0]['avatar'] || data[0]['full_name'] || data[0]['last_name']) {
                        return TableTDUserMulti;
                    }
                } else if (data.length === 0) {
                    return TableTDEmpty;
                } else {
                    if (data['avatar'] || data['full_name'] || data['last_name']) {
                        return TableTDUser;
                    }
                }
            }
        }

        return this.tBodyComponent;
    }

    get canUseUrl() {
        return this.props.url.value != '';
    }

    currentPage = ref(1)
    count = ref(0)

    getFilters(): Record<string, any> {
        if (this.filterForm) {
            return this.filterForm.obj.value ?? {};
        }
        return {};
    }

    onGetData() {
        this.isLoading.value = true;
        let url = this.props.url.value;
        const filters = this.getFilters();

        if (url.indexOf('?') > -1 && !url.endsWith('?')) {
            url += `&page=${this.currentPage.value}`;
        } else if (!url.endsWith('?')) {
            url += `?page=${this.currentPage.value}`;
        }

        if (this.method == 'get') {

            const qf = new URLSearchParams(filters);

            qf.set('json_filter', JSON.stringify(this.jsonFilters));

            console.log("this.orderedField.value.length", this.orderedField.value)
            if (this.orderedField.value.name) {
                qf.set('is_ord', '1');
                qf.set('ord_field', this.orderedField.value.name);
                qf.set('ord_dir', this.orderedField.value.order);
            }

            if (qf.toString() != '') {
                url += `&${qf.toString()}`
            }

            return ApiService.get(url).then(({data}) => {
                this.isLoading.value = false;
                this.count.value = data.count;
                return data.results;
            }, () => this.isLoading.value = false);

        } else {

            const tableData: any = {
                "json_filter": JSON.stringify(this.jsonFilters),
            };

            if (this.orderedField.value.length > 0) {
                tableData['is_ord'] = '1';
                tableData['ord_field'] = this.orderedField.value.name;
                tableData['ord_dir'] = this.orderedField.value.order;
            }

            Object.keys(filters).forEach((key) => {
                // if (filters[key])
                tableData[key] = filters[key];
                // tableData.append(key, filters[key]);
            });
            // if (url.indexOf('?') > -1 && !url.endsWith('?')) {
            //     url += `&page=${this.currentPage.value}`;
            // } else if (!url.endsWith('?')) {
            //     url += `?page=${this.currentPage.value}`;
            // }

            return ApiService.post(url, {
                data: tableData,
            }).then(({data}) => {
                this.isLoading.value = false;
                this.count.value = data.count;
                return data.results;
            }, () => this.isLoading.value = false);
        }
    }

    refresh(resetPage = false) {
        if (resetPage) {
            this.currentPage.value = 1;
        }
        return this.extra.onGetData();
    }

    /**
     * use this function to change items base on the data
     * context menu is asked for and not just for the table
     * it self
     */
    getContextMenuItems(data: any = undefined): Array<ContextMenuItem> {
        return this.contextMenuItems;
    }

    onShowFilter(header: any = undefined, index: any = undefined, customFilterField: any | FieldComponentPropsInterface = undefined) {
        if (customFilterField) {
            VueInstanceService.emit(`show-table-filter-${this.tableName}`, {customFilterField});
        } else {
            VueInstanceService.emit(`show-table-filter-${this.tableName}`, {fieldName: header});
        }
    }

    toggleOrder(header) {
        if (this.orderedField.value['name'] != header) {
            this.orderedField.value = {
                name: header,
            }
        }

        if (this.orderedField.value['order'] == 'asc')
            this.orderedField.value['order'] = 'desc';
        else if (this.orderedField.value['order'] == 'desc') {
            this.orderedField.value = {};
        }
        else
            this.orderedField.value['order'] = 'asc';
        console.log(this.orderedField)
        this.refresh();
    }
}