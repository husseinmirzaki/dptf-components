import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";
import { CreateForm } from "@/custom/helpers/BaseForm";
import { TokenService } from "@/custom/services/TokenService";
import { Actions, Mutations } from "@/custom/store/enums/StoreEnums";
import { Configs, VueInstanceService } from "@/Defaults";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default class LoginForm extends CreateForm {
  getService(): any {
    return TokenService;
  }

  login() {
    return new Promise((resolve, reject) => {
      const dispatch = VueInstanceService.store.dispatch(
        Actions.LOGIN,
        this.refs["basic"].value
      );
      dispatch.then(
        (data) => {
          if (!data.access && !data.refresh) {
            if (!data.token_needed) {
              this.finalize_login("21212", resolve, reject);
            } else {
              VueInstanceService.showSuccessMessage(
                "کد تایید برای شما ارسال شد"
              );
              Swal.fire({
                icon: "question",
                title: "کد تایید را وارد کنید",
                html: '<input id="swal-input-code" class="swal2-input">',
                focusConfirm: true,
                confirmButtonText: Configs.defaultTexts.submit,
                preConfirm: () => {
                  const element: any =
                    document.getElementById("swal-input-code");
                  if (element) return element.value;
                  return null;
                },
              }).then((e) => {
                if (e.isConfirmed && e.value != null) {
                  this.finalize_login(e.value, resolve, reject);
                } else {
                  resolve(e);
                }
              });
            }
          } else {
            VueInstanceService.store.commit(Mutations.SET_AUTH, data);
            VueInstanceService.store.dispatch(Actions.GET_ME).then(
              () => {
                VueInstanceService.router.push(Configs["defaultAfterLogin"]);
              },
              () => {
                VueInstanceService.store.commit(Mutations.PURGE_AUTH);
              }
            );
          }
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  finalize_login(token: string, resolve, reject) {
    VueInstanceService.store
      .dispatch(Actions.FINALIZE_LOGIN, {
        username: this.refs.basic.value.username,
        code: token,
      })
      .then(
        (e) => {
          resolve(null);
          VueInstanceService.router.push(Configs["defaultAfterLogin"]);
        },
        (e) => {
          // console.log("finalize login failed", e);
          reject(null);
        }
      );
  }

  submit(e): any {
    return this.login();
  }

  concatFields(): Array<FieldComponentPropsInterface> {
    return [
      {
        show_errors: false,
        defaultInputClasses: "",
        name: "username",
        placeholder: "نام کاربری",
        col_class: "",
      },
      {
        show_errors: false,
        defaultInputClasses: "",
        name: "password",
        placeholder: "کلمه عبور",
        field_type: "password",
        col_class: "",
      },
    ];
  }
}
