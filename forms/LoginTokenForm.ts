import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";
import {CreateForm} from "@/custom/helpers/BaseForm";
import * as Yup from "yup";
import {TokenService} from "@/custom/services/TokenService";
import {Actions} from "@/custom/store/enums/StoreEnums";
import {VueInstanceService} from "@/Defaults";
import {UserApiService} from "@/custom/services/UserApiService";

export default class LoginTokenForm extends CreateForm {
  getService(): any {
    return TokenService;
  }

  submit(v): any {
    // console.log(this.refs.basic.value);
    VueInstanceService.store.dispatch(Actions.FINALIZE_LOGIN, this.refs.basic.value).then((data) => {
      VueInstanceService.router.push('/dashboard')
    });
  }

  concatFields(): Array<FieldComponentPropsInterface> {
    return [
      {
        name: "code",
        label: "کد",
      },
    ];
  }
}
