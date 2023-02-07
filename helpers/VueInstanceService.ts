import {App, computed, Ref, ref, toRef, watch} from "vue";
import * as Yup from "yup";
import {addMethod, setLocale} from "yup";
import {Router} from "vue-router";
import {Actions} from "@/store/enums/StoreEnums";
import mitt from "mitt";
import {DragService} from "@/custom/components/DragService";
import {ApiService} from "@/Defaults";
import VueViewer from "v-viewer";
import VueSweetalert2 from "vue-sweetalert2";

export default class VueInstanceService {
    public static pageIsLoading = ref(false);

    public static simpleSharedData: any = null;

    public static vue: App;

    public static ignoreServerError = false;

    static loadingPermissions = ref(false);
    static permissions: Ref<Array<string>> = ref([]);


    public static init(instance: App) {
        DragService.init();
        ApiService.init(instance);
        const emitter = mitt();
        instance.config.globalProperties.emitter = emitter;
        VueInstanceService.vue = instance;
        instance.use(VueViewer);
        instance.use(VueSweetalert2);
        setLocale({
            mixed: {
                required: "فیلد `${path}` باید استفاده شود",
            },
            string: {
                min: "فیلد `${path}` باید حداقل ${min} کاراکتر باشد",
                max: "فیلد `${path}` باید حداکثر ${max} کاراکتر باشد",
                email: "فرمت ${path} اشتباه است",
            },
            number: {
                min: "مقدار فیلد `${path}` باید حداقل ${min} باشد",
                max: "مقدار فیلد `${path}` باید حداکثر ${max} باشد",
                positive: "مقدار فیلد `${path}` باید یک عدد مثبت باشد",
            },
        });

        addMethod(Yup.array, "checkSelect", function (errorMessage) {
            return this.test({
                name: "checkSelect",
                message: errorMessage,
                test: function (value) {
                    return value ? value.length > 0 : !!value;
                },
            });
        });

        addMethod(Yup.string, "checkSingleSelect", function (errorMessage) {
            return this.test({
                name: "checkSingleSelect",
                message: errorMessage,
                test: function (value) {
                    return value !== "" && !!value;
                },
            });
        });

        window.onbeforeunload = () => {
            if (this.pageIsLoading.value) {
                return "Page is Loading Sth right now";
            }
        };
    }

    public static emit(event: string, e?: unknown) {
        if (e) this.vue.config.globalProperties["emitter"].emit(event, e);
        else this.vue.config.globalProperties["emitter"].emit(event);
    }

    public static off(event: string, e?: unknown) {
        this.vue.config.globalProperties["emitter"].off(event, e);
    }

    public static on(event: string, e?: unknown) {
        this.vue.config.globalProperties["emitter"].on(event, e);
    }

    public static get store() {
        return VueInstanceService.vue.config.globalProperties["$store"];
    }

    public static get router(): Router {
        return VueInstanceService.vue.config.globalProperties["$router"];
    }

    public static get route(): any {
        return VueInstanceService.vue.config.globalProperties["$route"];
    }

    public static showErrorMessage(
        text,
        title: string | null = null,
        position = "bottom-left"
    ) {
        this.vue.config.globalProperties["$notify"]({
            title: title,
            message: text,
            type: "warning",
            duration: 1000,
            position: position,
        });
    }

    public static showSuccessMessage(text) {
        this.vue.config.globalProperties["$notify"]({
            // title: 'Warning',
            message: text,
            type: "success",
            position: "bottom-left",
        });
    }

    public static swal(config: any): Promise<any> {
        return this.vue.config.globalProperties["$swal"](config);
    }

    public static setPageTitle(title: string) {
        this.store.dispatch(Actions.SET_BREADCRUMB_ACTION, {
            title: title,
        });
    }

    public static getUser(func: any) {
        if (!this.store.getters.currentUser.id) {
            const w = watch(
                toRef(this.store.getters, "currentUser"),
                () => {
                    func(this.store.getters.currentUser);
                    w();
                },
                {deep: true}
            );
        } else {
            func(this.store.getters.currentUser);
        }
    }
    public static getPermissions() {
        this.loadingPermissions.value = true;
        // AcuApiService.permissions().then(({data}) => {
        //     this.permissions.value = data.split(",");
        //     this.loadingPermissions.value = false;
        // }, () => this.loadingPermissions.value = false);
    }

    public static buildPermissions(permission: string | Array<string>): string | Array<string> {
        if (Array.isArray(permission)) {
            permission = permission.map((p) => this.buildPermissions(p) as string);
        } else {
            if (permission.startsWith("[]")) {
                permission = permission.substr(2);
                const toListenTo = ["add", "change", "view", "delete"];
                return toListenTo.map((e) => e + "_" + permission)
            }
        }
        return permission;
    }

    public static onLoadedPermissions(_watch: (permissions: Array<string>) => void) {
        if (this.loadingPermissions.value == false) {
            _watch(this.permissions.value);
            return;
        }
        watch(this.loadingPermissions, (e) => {
            if (!e) {
                _watch(this.permissions.value);
            }
        });
    }

    public static watchLoadingPermission() {
        return computed(() => {
            return !this.loadingPermissions.value;
        });
    }

    public static watchPermission(permission: string) {
        if (permission.startsWith("[]")) {
            return this.watchPermissions(this.buildPermissions(permission))
        }
        return computed(() => {
            return this.permissions.value.indexOf(permission) > -1;
        });
    }

    public static watchPermissions(permissions: Array<any> | string) {
        return computed(() => {
            return this.hasAnyPermission(permissions);
        });
    }

    public static hasPermission(permission: string | Array<string>, filter: ((e: string) => boolean) | undefined = undefined) {
        if (Array.isArray(permission)) {
            if (filter) {
                permission = permission.filter(filter);
            }
            for (let i = 0; i < permission.length; i++) {
                if (!this.hasPermission(permission[i]))
                    return false;
            }
            return true;
        } else if (permission.startsWith("[]")) {
            const builtPermissions = this.buildPermissions(permission);
            if (filter && Array.isArray(builtPermissions))
                return this.hasPermission(builtPermissions.filter(filter));
            return this.hasPermission(builtPermissions);
        }
        return this.permissions.value.indexOf(permission) > -1;
    }

    public static hasAnyPermission(permission: string | Array<string>, filter: ((e: string) => boolean) | undefined = undefined) {
        if (Array.isArray(permission)) {
            if (filter) {
                permission = permission.filter(filter);
            }

            for (let i = 0; i < permission.length; i++) {
                if (this.hasAnyPermission(permission[i]))
                    return true;
            }
            return false;
        } else if (permission.startsWith("[]")) {
            const builtPermissions = this.buildPermissions(permission);
            if (filter && Array.isArray(builtPermissions)) {
                return this.hasAnyPermission(builtPermissions.filter(filter));
            }
            return this.hasAnyPermission(builtPermissions);
        }
        return this.permissions.value.indexOf(permission) > -1;
    }

    public static getRoutePermissions() {
        return this.route.meta["permissionName"];
    }

    public static routeHasViewPermission(showError = true) {
        const hasAnyPermission = this.hasAnyPermission(this.getRoutePermissions(), (e) => e.startsWith("view_"));
        if (!hasAnyPermission && showError) {
            VueInstanceService.showErrorMessage("شما دسترسی نمایش دادن ندارید");
        }
        return hasAnyPermission;
    }

    public static routeHasDeletePermission(showError = true) {
        const hasAnyPermission = this.hasAnyPermission(this.getRoutePermissions(), (e) => e.startsWith("delete_"));
        if (!hasAnyPermission && showError) {
            VueInstanceService.showErrorMessage("شما دسترسی حذف کردن ندارید");
        }
        return hasAnyPermission;
    }

    public static routeHasChangePermission(showError = true) {
        const hasAnyPermission = this.hasAnyPermission(this.getRoutePermissions(), (e) => e.startsWith("change_"));
        if (!hasAnyPermission && showError) {
            VueInstanceService.showErrorMessage("شما دسترسی ویرایش کردن ندارید");
        }
        return hasAnyPermission;
    }

    public static routeHasAddPermission(showError = true) {
        const hasAnyPermission = this.hasAnyPermission(this.getRoutePermissions(), (e) => e.startsWith("add_"));
        if (!hasAnyPermission && showError) {
            VueInstanceService.showErrorMessage("شما دسترسی اضافه کردن ندارید");
        }
        return hasAnyPermission;
    }

}
