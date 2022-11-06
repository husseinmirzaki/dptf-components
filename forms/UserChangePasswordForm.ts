import FieldComponentPropsInterface from '@/custom/components/FieldComponentPropsInterface';
import { CreateForm } from '@/custom/helpers/BaseForm';
import { UserApiService } from '@/custom/services/UserApiService';
import * as Yup from 'yup';
import { ResetPasswordForm } from '@/custom/forms/ResetPasswordForm';

export default class UserChangePasswordForm extends ResetPasswordForm {
  getService(): any {
    return UserApiService;
  }

  change_password(event) {
    return new Promise((resolve, reject) => {
      const data = super.submit(event, true);
      this.getService()
        .changePassword(data)
        .then(
          (e) => {
            resolve(e);
          },
          (e) => reject(e)
        );
    });
  }

  concatFields(): Array<FieldComponentPropsInterface> {
    return [
      {
        name: 'old_password',
        field_type: 'password',
        placeholder: 'رمز عبور فعلی',
        col_class: 'col-lg-12 col-xl-6 mt-2',
      },
      {
        name: 'new_password',
        field_type: 'password',
        placeholder: 'رمز عبور جدید',
        col_class: 'col-lg-12 col-xl-6 mt-2',
      },
      {
        name: 'new_password_repeat',
        field_type: 'password',
        placeholder: 'تکرار رمز عبور جدید',
        col_class: 'col-lg-12 col-xl-6 mt-2',
        validation: [
          Yup.string()
            .required()
            .oneOf(
              [Yup.ref('new_password')],
              'رمزعبور و تکرار آن باید یکی باشد'
            )
            .label('تکرار رمز عبور'),
        ],
      },
    ];
  }
}
