import FieldComponentPropsInterface from '@/custom/components/FieldComponentPropsInterface';
import { CreateForm } from '@/custom/helpers/BaseForm';
import { TokenService } from '@/custom/services/TokenService';
import { Actions, Mutations } from '@/custom/store/enums/StoreEnums';
import { VueInstanceService } from '@/Defaults';
import Swal from 'sweetalert2/dist/sweetalert2.js';

export class ForgottenPasswordForm extends CreateForm {
  getService(): any {
    return TokenService;
  }

  forgotten() {
    return new Promise<void>((resolve, reject) => {
      const dispatch = VueInstanceService.store.dispatch(
        Actions.FORGOT_PASSWORD,
        this.refs['basic'].value
      );
      dispatch.then(
        (data) => {
          VueInstanceService.store.commit(
            Mutations.SET_FORGOTTEN_USER,
            this.refs['basic'].value['username']
          );
          VueInstanceService.router.push({ name: 'reset-password' });
          resolve();
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
        defaultInputClasses: 'w-100',
        name: 'username',
        placeholder: 'نام کاربری',
        col_class: 'w-100',
      },
    ];
  }
}
