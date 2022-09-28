import {Table} from "@/custom/components/table/Table";
import {ContextMenuItem} from "@/custom/components/ContextMenuService";

export function extendClassOnTBodyProps(callBack: any, extendClass: any | undefined = undefined) {
    if (!extendClass)
        extendClass = Table

    class ExtendClass extends extendClass {
        onTBodyProps(item, header, index, rowIndex: string | number | undefined = undefined): any {
            const r = callBack(item, header, index, rowIndex);
            if (r) {
                return r;
            }
            return super.onTBodyProps(item, header, index, rowIndex);
        }
    }

    return ExtendClass
}

export function extendClassOnTBodyComponent(callBack: any, extendClass: any | undefined = undefined) {
    if (!extendClass)
        extendClass = Table

    class ExtendClass extends extendClass {

        onTBodyComponent(item, header, index, rowIndex: string | number | undefined = undefined): any {
            const r = callBack(item, header, index, rowIndex);
            if (r) {
                return r;
            }
            return super.onTBodyComponent(item, header, index, rowIndex);
        }
    }

    return ExtendClass;
}

export class ExtendClass {

    configs: Record<string, any> = {};

    constructor(extendClass: any) {
        this.configs['extendClass'] = extendClass;
    }

    public static build(extendClass: any = undefined) {
        return new ExtendClass(extendClass)
    }

    public addHeader(header: string, index = -1) {
        if (!this.configs['headersToAdd'])
            this.configs['headersToAdd'] = {};

        this.configs['headersToAdd'][header] = {
            index
        };
        return this;
    }

    public removeHeader(header: string) {
        if (!this.configs['headersToRemove'])
            this.configs['headersToRemove'] = {};

        this.configs['headersToRemove'].push(header);
        return this;
    }

    public onTBodyProps(header: string, callBack: any) {
        if (!this.configs['tBodyProps'])
            this.configs['tBodyProps'] = {};

        this.configs['tBodyProps'][header] = {
            callBack
        }
        return this;
    }

    public onTBodyComponent(header: string, callBack: any) {
        if (!this.configs['tBodyComponent'])
            this.configs['tBodyComponent'] = {};

        this.configs['tBodyComponent'][header] = {
            callBack
        }
        return this;
    }

    public hideDeleteMenu() {
        this.configs['hideDeleteMenu'] = true;
        return this;
    }

    public hideUpdateMenu() {
        this.configs['hideUpdateMenu'] = true;
        return this;
    }

    public hideShowMenu() {
        this.configs['hideShowMenu'] = true;
        return this;
    }

    public onContextMenu(callBack) {
        this.configs['onContextMenu'] = {
            callBack,
        };
        return this;
    }

    public getClass() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this;
        let _extendClass = _this.configs['extendClass']
        if (!_extendClass) {
            _extendClass = Table;
        }

        class TableExtendClass extends Table {

            headers(list): Array<string> {
                const headers = super.headers(list);

                if (_this.configs['headersToAdd'])
                    Object.keys(_this.configs['headersToAdd']).forEach((header) => {
                        const _index = _this.configs['headersToAdd'][header];
                        if (_index > headers.length - 1) {
                            headers.push(header);
                        } else if (_index < headers.length - 1) {
                            headers.unshift(header);
                        } else {
                            headers.splice(_index, 0, header)
                        }
                    })

                if (_this.configs['headersToRemove'])
                    _this.configs['headersToAdd'].forEach((header) => {
                        const _headerIndex = headers.indexOf(header);
                        if (_headerIndex > -1) {
                            headers.splice(_headerIndex, 1);
                        }
                    });

                return headers;
            }

            onTBodyProps(item, header, index, rowIndex: string | number | undefined = undefined): any {
                if (_this.configs['tBodyProps'] && _this.configs['tBodyProps'][header]) {
                    const result = _this.configs['tBodyProps'][header].callBack(item, index, rowIndex)
                    if (result) {
                        return result;
                    }
                }

                return super.onTBodyProps(item, header, index, rowIndex);
            }

            onTBodyComponent(item, header, index, rowIndex: string | number | undefined = undefined): any {
                if (_this.configs['tBodyComponent'] && _this.configs['tBodyComponent'][header]) {
                    const result = _this.configs['tBodyComponent'][header].callBack(item, index, rowIndex)
                    if (result) {
                        return result;
                    }
                }
                return super.onTBodyComponent(item, header, index, rowIndex);
            }

            get showContextMenuView(): boolean {
                return !_this.configs['hideShowMenu'];
            }

            get showContextMenuUpdate(): boolean {
                return !_this.configs['hideUpdateMenu'];
            }

            get showContextMenuDelete(): boolean {
                return !_this.configs['hideDeleteMenu'];
            }

            getContextMenuItems(data: any = undefined): Array<ContextMenuItem> {
                if (_this.configs['onContextMenu']) {
                    const result = _this.configs['onContextMenu'].callBack(data);
                    if (result) {
                        return result;
                    }
                }
                return super.getContextMenuItems(data);
            }
        }

        return TableExtendClass;
    }
}