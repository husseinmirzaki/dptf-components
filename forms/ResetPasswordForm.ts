import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";
import { CreateForm } from "@/custom/helpers/BaseForm";
import { TokenService } from "@/custom/services/TokenService";
import { Actions } from "@/custom/store/enums/StoreEnums";
import { VueInstanceService } from "@/Defaults";
import * as Yup from "yup";

export class ResetPasswordForm extends CreateForm {
  getService(): any {
    return TokenService;
  }

  resetPassword() {
    return new Promise((resolve, reject) => {
      const data = this.refs["basic"].value;
      data["username"] = VueInstanceService.store.getters.currentForgottenUser;
      // console.log(data);
      const dispatch = VueInstanceService.store.dispatch(
        Actions.SET_FORGOT_PASSWORD,
        data
      );
      dispatch.then(
        (data) => {
          VueInstanceService.router.push({ name: "sign-in" });
          VueInstanceService.showSuccessMessage(
            "کلمه عبور شما با موفقیت تغییر کرد"
          );
        },
        (e) => {
          reject(e);
        }
      );
    });
  }

  concatFields(): Array<FieldComponentPropsInterface> {
    return [
      {
        show_errors: false,
        defaultInputClasses: "w-100",
        name: "code",
        placeholder: "کد تایید",
        col_class: "col-lg-12 col-xl-6 mt-2",
      },
      {
        show_errors: false,
        defaultInputClasses: "w-100",
        name: "password",
        placeholder: "رمز عبور",
        col_class: "col-lg-12 col-xl-6 mt-2",
      },
      {
        show_errors: false,
        defaultInputClasses: "w-100",
        name: "passwordRepeat",
        placeholder: "تکرار رمز عبور",
        col_class: "col-lg-12 col-xl-6 mt-2",
        validation: [
          Yup.string()
            .required()
            .oneOf([Yup.ref("password")], "رمزعبور و تکرار آن باید یکی باشد")
            .label("تکرار رمز عبور"),
        ],
      },
    ];
  }
}
