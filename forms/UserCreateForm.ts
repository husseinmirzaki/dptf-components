import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";
import {CreateForm} from "@/custom/helpers/BaseForm";
import {UserApiService} from "@/custom/services/UserApiService";
import * as Yup from "yup";

export const genderOptions = {
    "0": "مرد",
    "1": "زن",
}

export const yesNoMobileVerification = {
    "true": "بلی",
    "false": "خیر",
}

export default class UserCreateForm extends CreateForm {
    getService(): any {
        return UserApiService;
    }

    create(event, posts) {
        return new Promise((resolve, reject) => {
            const data = super.submit(event, true);
            if(posts)
                data['posts'] = posts
            this.getService().create(data).then((e) => {resolve(e)}, (e) => reject(e));
        });
    }

    concatFields(): Array<FieldComponentPropsInterface> {
        return [
            {
                name: "first_name",
                placeholder: "نام",
                label: "نام",
                col_class: 'col-lg-12 col-xl-6 mt-2',
            },
            {
                name: "last_name",
                placeholder: "نام خانوادگی",
                label: "نام خانوادگی",
                col_class: 'col-lg-12 col-xl-6 mt-2',
            },
            {
                name: "username",
                placeholder: "شماره موبایل",
                label: "شماره موبایل",
                col_class: 'col-lg-12 col-xl-6 mt-2',
                // validation: [
                //     yup.string().required()['checkPostDuplication']("مورد انتخاب شده تکراری است").label("سمت"),
                // ]
            },
            {
                name: "id_number",
                placeholder: "کد ملی",
                label: "کد ملی",
                col_class: 'col-lg-12 col-xl-6 mt-2',
            },
            {
                col_class: 'col-lg-12 col-xl-6 mt-2',
                name: "birth_date",
                field_type: 'p-date-time',
                placeholder: "تاریخ تولد",
                label: "تاریخ تولد",
                required: false,
            },
            {
                name: "gender",
                field_type : "select",
                select_data: this.optionToSelect2Option(genderOptions),
                placeholder: "جنسیت",
                label: "جنسیت",
                col_class: 'col-lg-12 col-xl-6 mt-2',
            },
            {
                name: "is_mobile_validation",
                field_type : "select",
                select_data: this.optionToSelect2Option(yesNoMobileVerification),
                placeholder: "اعتبار سنجی شماره موبایل",
                label: "اعتبار سنجی شماره موبایل",
                col_class: 'col-lg-12 col-xl-6 mt-2',
            },
            {
                name: "password",
                field_type : "password",
                placeholder: "رمز عبور",
                label: "رمز عبور",
                col_class: 'col-lg-12 col-xl-6 mt-2',
            },
            {
                name: "repeat_password",
                field_type : "password",
                placeholder: "تکرار رمز عبور",
                label: "تکرار رمز عبور",
                col_class: 'col-lg-12 col-xl-6 mt-2',
                validation: [
                    Yup.string().required().oneOf([Yup.ref("password")], "رمزعبور و تکرار آن باید یکی باشد").label('تکرار رمز عبور'),
                ]
            },
        ];
    }
}
