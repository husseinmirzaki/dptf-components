import {ApiService} from "@/Defaults";
import _$ from "jquery";
import "select2/dist/js/select2.full";
import "@/custom/css/select2.css";
import JwtService from "@/custom/core/services/JwtService";
import {ref} from "vue";
import {MenuComponent} from "@/assets/ts/components";

export const $ = _$;

export function select2(
    e,
    url: string | null | (() => string) = null,
    options: Record<string, unknown> | null = null,
    onTokenRefresh: () => void
) {
    const defaultOptions = {
        dir: "rtl",
        placeholder: "انتخاب کنید",
        onParams: (_data) => {
            //
        },
        processResults: (_data) => {
            return _data;
        }
    };

    // console.log("select2 before", options);

    if (!options) options = {};

    options = $.extend(true, defaultOptions, options);

    if (options)
        options["language"] = {
            noResults: function () {
                if (options!.tags) {
                    return "متن + Enter";
                }
                return "موردی موجود نمی‌باشد";
            },
        };

    const _count = ref(0);

    if (typeof url === "function") {
        const _urlGenerator = () => {
            if (typeof url == "function") return ApiService.base_url + url();
            return ApiService.base_url + url;
        };
        options!["ajax"] = {
            url: _urlGenerator,
            headers: {
                "Content-Type": "application/json",
            },
            processResults: options!["processResults"],
            data: (params) => {
                const _data = {
                    search: params.term,
                    page: params.page || 1,
                };

                if (_count.value > 0 && _data.page > 1) _data["count"] = _count.value;
                (options!["onParams"] as any)(_data);
                return _data;
            },
            success: (e) => {
                if (e.total) _count.value = e.total;
            },
            error: (e) => {
                if (e.status === 401 && onTokenRefresh) onTokenRefresh();
            },
        };
    } else if (url && url != "" && !options!["ajax"]) {
        options!["ajax"] = {
            url: url,
            headers: {
                "Content-Type": "application/json",
            },
            processResults: options!["processResults"],
            data: function (params) {
                const _data = {
                    search: params.term,
                    page: params.page || 1,
                };

                if (_count.value > 0 && _data.page > 1) _data["count"] = _count.value;
                (options!["onParams"] as any)(_data);
                return _data;
            },
            success: (e) => {
                if (e.total) _count.value = e.total;
            },
            error: (e) => {
                if (e.status === 401 && onTokenRefresh) onTokenRefresh();
            },
        };
    }

    // console.log("select2", options);
    $.ajaxSetup({
        beforeSend: function (xhr) {
            const token = "Bearer " + JwtService.getToken();
            if (token) xhr.setRequestHeader("Authorization", token);
        },
    });
    return $(e).select2(options);
}

export function userToSelect2(user) {
    if (user)
        return {
            text: user.first_name + " " + user.last_name,
            value: user.id,
        };

    return {
        text: "",
        value: 0,
    };
}

export function usersToSelect2(users) {
    const usersSelect2: Array<any> = [];
    users.forEach((user) => {
        usersSelect2.push(userToSelect2(user));
    });
    return usersSelect2;
}

export function closeAllOpenInstance() {
    document.querySelectorAll(".select2-dropdown").forEach((e) => {
        e.remove();
    });
    MenuComponent.hideDropdowns(undefined);
}
