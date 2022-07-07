import {ApiService} from "@/Defaults";
import {VueInstanceService} from "@/Defaults";

export class UserApiService extends ApiService {

    static baseUrl = 'user/';

    public static getMe() {
        return ApiService.get(this.baseUrl + 'me/')
    }

    public static getUser(id) {
        return ApiService.get(this.baseUrl + `info/${id}/`)
    }

    public static get userSelectionUrl() {
        return this.baseUrl + 'select/'
    }

    public static register(data) {
        return ApiService.post("user/register/", {
            data: data,
            dont_set_header: true,
        });
    }

    public static accept(id, isMobileVerification, posts) {
        return ApiService.patch(`${this.baseUrl}${id}/confirm/`, {
            data: {
                is_mobile_verification: isMobileVerification,
                posts: posts
            },
        });
    }

    public static reject(id) {
        return ApiService.patch(`${this.baseUrl}${id}/reject/`, {
            data: {
                is_confirmed: false,
            },
        });
    }

    public static delete(id) {
        return ApiService.delete(`${this.baseUrl}${id}/`);
    }

    public static create(data) {
        return ApiService.post(`${this.baseUrl}`, {
            data: data
        });
    }

    public static changePassword(data) {
        return ApiService.patch(`${this.baseUrl}change_password/`, {
            data: data
        });
    }

    public static superuserChangePassword(id,data) {
        return ApiService.patch(`${this.baseUrl}superuser_change_password/`, {
            data: {
                user_id: id,
                ...data
            }
        });
    }

    public static update(data, id) {
        return ApiService.patch(`${this.baseUrl}${id}/`, {
            data: data
        });
    }

    public static updateSignature(id, data) {
        return ApiService.patch(`${this.baseUrl}update_signature/`, {
            data: {
                user_id: id,
                signature: data,
            }
        }).then((e) => {
            VueInstanceService.showSuccessMessage("امضاء کاربر با موفقیت بروزرسانی شد");
            return e;
        });
    }

    public static updateAvatar(id, data) {
        return ApiService.patch(`${this.baseUrl}update_avatar/`, {
            data: {
                user_id: id,
                avatar: data,
            }
        }).then((e) => {
            VueInstanceService.showSuccessMessage("تصویر پروفایل کاربر با موفقیت بروزرسانی شد");
            return e;
        });
    }

    public static userToText(ids) {
        return ApiService.post(this.baseUrl + "user_to_text/", {
            data: {
                users: ids,
            }
        });
    }

    public static usersToText(ids) {
        return ApiService.post(this.baseUrl + "users_to_text/", {
            data: {
                users: ids,
            }
        });
    }
}