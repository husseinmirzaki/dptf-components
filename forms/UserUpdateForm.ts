import FieldComponentPropsInterface from "@/custom/components/FieldComponentPropsInterface";
import {CreateForm} from "@/custom/helpers/BaseForm";
import {UserApiService} from "@/custom/services/UserApiService";
import * as Yup from "yup";
import {watch} from "vue";
import {ExternalContactApiService} from "@/mail_box_custom/services/ExternalContactApiService";
import {Actions} from "@/custom/store/enums/StoreEnums";
import {VueInstanceService} from "@/Defaults";

export const genderOptions = {
    "0": "مرد",
    "1": "زن",
}

export const yesNoMobileVerification = {
    "true": "بلی",
    "false": "خیر",
}

export const activateOptions = {
    "true": "فعال",
    "false": "غیر فعال",
}

export default class UserUpdateForm extends CreateForm {
    getService(): any {
        return UserApiService;
    }

    update(event, id) {
        return new Promise((resolve, reject) => {
            const data = super.submit(event, true);
            this.getService().update(data, id).then((e) => {
                resolve(e);
                VueInstanceService.store.dispatch(Actions.GET_ME);
            }, (e) => reject(e));
        });
    }

    // watchStuff(cb: any) {
    //     watch(this.refs.basic, (data) => {
    //         if (cb) {
    //             cb(data);
    //         }
    //     }, {deep: true});
    // }

    concatFields(): Array<FieldComponentPropsInterface> {
        return [
            {
                name: "first_name",
                label: "نام",
                col_class: 'col-lg-12 col-xl-6 mt-2',
            },
            {
                name: "last_name",
                label: "نام خانوادگی",
                col_class: 'col-lg-12 col-xl-6 mt-2',
            },
            {
                name: "id_number",
                label: "کد ملی",
                col_class: 'col-lg-12 col-xl-6 mt-2',
            },
            {
                col_class: 'col-lg-12 col-xl-6 mt-2',
                name: "birth_date",
                field_type: 'p-date-time',
                label: "تاریخ تولد",
            },
            {
                name: "gender",
                field_type: "select",
                select_data: this.optionToSelect2Option(genderOptions),
                label: "جنسیت",
                col_class: 'col-lg-12 col-xl-6 mt-2',
            },
            {
                name: "is_mobile_validation",
                field_type: "select",
                select_data: this.optionToSelect2Option(yesNoMobileVerification),
                label: "اعتبار سنجی شماره موبایل",
                col_class: 'col-lg-12 col-xl-6 mt-2',
            },
            {
                name: "is_active",
                field_type: "select",
                select_data: this.optionToSelect2Option(activateOptions),
                label: "وضعیت کاربر",
                col_class: 'col-lg-12 col-xl-6 mt-2',
            },
        ];
    }
}
