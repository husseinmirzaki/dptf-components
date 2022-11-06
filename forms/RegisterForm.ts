import { CreateForm } from '@/custom/helpers/BaseForm';
import FieldComponentProps from '@/custom/components/FieldComponentPropsInterface';
import { UserApiService } from '@/custom/services/UserApiService';
import { VueInstanceService } from '@/Defaults';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Actions } from '@/custom/store/enums/StoreEnums';
import * as Yup from 'yup';

export const genderOptions = {
  '0': 'مرد',
  '1': 'زن',
};

export default class RegisterForm extends CreateForm {
  getService(): any {
    return UserApiService;
  }

  finalize_login(token: string, resolve, reject) {
    VueInstanceService.store
      .dispatch(Actions.FINALIZE_LOGIN, {
        username: this.refs.basic.value.phone_number,
        code: token,
      })
      .then((e) => {
        resolve(null);
        VueInstanceService.router.push('/dashboard');
      })
      .catch((e) => resolve(null));
  }

  showConfirmSwal(resolve, reject) {
    VueInstanceService.showSuccessMessage('کد تایید برای شما ارسال شد');
    Swal.fire({
      icon: 'question',
      title: 'کد تایید را وارد کنید',
      confirmButtonText: 'ارسال',
      html: '<input id="swal-input-code" class="swal2-input">',
      focusConfirm: true,
      preConfirm: () => {
        const element: any = document.getElementById('swal-input-code');
        if (element) return element.value;
        return null;
      },
    }).then(
      (e) => {
        if (e.isConfirmed && e.value != null) {
          this.finalize_login(e.value, resolve, reject);
        } else {
          resolve(e);
        }
      },
      (e) => reject(e)
    );
  }

  submit(event) {
    return new Promise((resolve, reject) => {
      const data = super.submit(event, true);
      this.getService()
        .register(data)
        .then(
          () => {
            this.showConfirmSwal(resolve, reject);
          },
          (e) => reject(e)
        );
    });
  }

  concatFields(): Array<FieldComponentProps> {
    return [
      {
        show_errors: false,
        defaultInputClasses: '',
        name: 'first_name',
        placeholder: 'نام',
        col_class: '',
      },
      {
        show_errors: false,
        defaultInputClasses: '',
        name: 'last_name',
        placeholder: 'نام خانوادگی',
        col_class: '',
      },
      {
        show_errors: false,
        defaultInputClasses: '',
        name: 'id_number',
        placeholder: 'شماره ملی',
        col_class: '',
      },
      {
        show_errors: false,
        defaultInputClasses: '',
        name: 'phone_number',
        placeholder: 'شماره موبایل',
        col_class: '',
      },
      {
        show_errors: false,
        defaultInputClasses: '',
        name: 'gender',
        field_type: 'select',
        select_data: this.optionToSelect2Option(genderOptions),
        placeholder: 'جنسیت',
        col_class: '',
      },
      {
        show_errors: false,
        defaultInputClasses: '',
        name: 'password',
        field_type: 'password',
        placeholder: 'رمز عبور',
        col_class: '',
      },
      {
        show_errors: false,
        defaultInputClasses: '',
        name: 'repeat_password',
        field_type: 'password',
        placeholder: 'تکرار رمز عبور',
        col_class: '',
        validation: [
          Yup.string()
            .required()
            .oneOf([Yup.ref('password')], 'رمزعبور و تکرار آن باید یکی باشد')
            .label('تکرار رمز عبور'),
        ],
      },
    ];
  }
}
