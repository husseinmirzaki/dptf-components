import {App, ref} from "vue";
import {setLocale, addMethod} from "yup";
import * as Yup from "yup";
import {Router} from "vue-router";

export default class VueInstanceService {
    public static pageIsLoading = ref(false);

    public static simpleSharedData: any = null;

    public static vue: App;

    public static init(instance: App) {
        VueInstanceService.vue = instance;
        setLocale({
            mixed: {
                required: "فیلد `${path}` باید استفاده شود"
            },
            string: {
                min: "فیلد `${path}` باید حداقل ${min} کاراکتر باشد",
                max: "فیلد `${path}` باید حداکثر ${max} کاراکتر باشد",
                email: "فرمت ${path} اشتباه است"
            }
        });

        addMethod(Yup.array, "checkSelect", function (errorMessage) {
            return this.test({
                name: "checkSelect",
                message: errorMessage,
                test: function (value) {
                    return value ? value.length > 0 : !!value;
                }
            });
        });

        addMethod(Yup.string, "checkSingleSelect", function (errorMessage) {
            return this.test({
                name: "checkSingleSelect",
                message: errorMessage,
                test: function (value) {
                    return value !== '' && !!value;
                }
            });
        });

        window.onbeforeunload = () => {
            if (this.pageIsLoading.value) {
                return "Page is Loading Sth right now";
            }
        }
    }

    public static emit(event: string, e?: unknown) {
        if (e) this.vue.config.globalProperties["emitter"].emit(event, e);
        else this.vue.config.globalProperties["emitter"].emit(event);
    }

    public static on(event: string, e?: unknown) {
        this.vue.config.globalProperties["emitter"].on(event, e);
    }

    public static get store() {
        return VueInstanceService.vue.config.globalProperties['$store'];
    }

    public static get router(): Router {
        return VueInstanceService.vue.config.globalProperties['$router'];
    }

    public static get route(): any {
        return VueInstanceService.vue.config.globalProperties['$route'];
    }

    public static showErrorMessage(
        text,
        title: string | null = null,
        duration = 4000,
        position = "bottom-left"
    ) {
        this.vue.config.globalProperties["$notify"]({
            title: title,
            message: text,
            type: "warning",
            duration: duration,
            position: position
        });
    }

    public static showSuccessMessage(text) {
        this.vue.config.globalProperties["$notify"]({
            // title: 'Warning',
            message: text,
            type: "success",
            position: "bottom-left"
        });
    }
}
