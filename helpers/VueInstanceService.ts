import {App} from "vue";
import {setLocale, addMethod} from "yup";
import * as Yup from "yup";

export class VueInstanceService {
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

    public static get router() {
        return VueInstanceService.vue.config.globalProperties['$router'];
    }

    public static showErrorMessage(
        text,
        title: string | null = null,
        duration = 4000
    ) {
        this.vue.config.globalProperties["$notify"]({
            title: title,
            message: text,
            type: "warning",
            duration: duration,
        });
    }

    public static showSuccessMessage(text) {
        this.vue.config.globalProperties["$notify"]({
            // title: 'Warning',
            message: text,
            type: "success",
        });
    }
}
