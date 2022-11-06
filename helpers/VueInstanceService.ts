import { App, ref, toRef, watch } from 'vue';
import * as Yup from 'yup';
import { addMethod, setLocale } from 'yup';
import { Router } from 'vue-router';
import { Actions } from '@/store/enums/StoreEnums';
import {
  hasAnyPerm,
  hasAnyRole,
  PermissionService,
} from '@/custom/services/PermissionService';

export default class VueInstanceService {
  public static pageIsLoading = ref(false);

  public static simpleSharedData: any = null;

  public static vue: App;

  public static ignoreServerError = false;

  public static init(instance: App) {
    VueInstanceService.vue = instance;
    setLocale({
      mixed: {
        required: 'فیلد `${path}` باید استفاده شود',
      },
      string: {
        min: 'فیلد `${path}` باید حداقل ${min} کاراکتر باشد',
        max: 'فیلد `${path}` باید حداکثر ${max} کاراکتر باشد',
        email: 'فرمت ${path} اشتباه است',
      },
      number: {
        min: 'مقدار فیلد `${path}` باید حداقل ${min} باشد',
        max: 'مقدار فیلد `${path}` باید حداکثر ${max} باشد',
        positive: 'مقدار فیلد `${path}` باید یک عدد مثبت باشد',
      },
    });

    addMethod(Yup.array, 'checkSelect', function (errorMessage) {
      return this.test({
        name: 'checkSelect',
        message: errorMessage,
        test: function (value) {
          return value ? value.length > 0 : !!value;
        },
      });
    });

    addMethod(Yup.string, 'checkSingleSelect', function (errorMessage) {
      return this.test({
        name: 'checkSingleSelect',
        message: errorMessage,
        test: function (value) {
          return value !== '' && !!value;
        },
      });
    });

    window.onbeforeunload = () => {
      if (this.pageIsLoading.value) {
        return 'Page is Loading Sth right now';
      }
    };
  }

  public static emit(event: string, e?: unknown) {
    if (e) this.vue.config.globalProperties['emitter'].emit(event, e);
    else this.vue.config.globalProperties['emitter'].emit(event);
  }

  public static off(event: string, e?: unknown) {
    this.vue.config.globalProperties['emitter'].off(event, e);
  }

  public static on(event: string, e?: unknown) {
    this.vue.config.globalProperties['emitter'].on(event, e);
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
    position = 'bottom-left'
  ) {
    this.vue.config.globalProperties['$notify']({
      title: title,
      message: text,
      type: 'warning',
      duration: duration,
      position: position,
    });
  }

  public static showSuccessMessage(text) {
    this.vue.config.globalProperties['$notify']({
      // title: 'Warning',
      message: text,
      type: 'success',
      position: 'bottom-left',
    });
  }

  public static swal(config: any): Promise<any> {
    return this.vue.config.globalProperties['$swal'](config);
  }

  public static setPageTitle(title: string) {
    this.store.dispatch(Actions.SET_BREADCRUMB_ACTION, {
      title: title,
    });
  }

  public static getUser(func: any) {
    if (!this.store.getters.currentUser.id) {
      const w = watch(
        toRef(this.store.getters, 'currentUser'),
        () => {
          func(this.store.getters.currentUser);
          w();
        },
        { deep: true }
      );
    } else {
      func(this.store.getters.currentUser);
    }
  }
}
