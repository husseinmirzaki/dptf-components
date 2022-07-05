import MockAdapter from "axios-mock-adapter";
import {ApiService} from "@/Defaults";

export function initMockAdapter(axios) {
    const mock = new MockAdapter(axios);

    // mock.onAny(/user/).reply(200, {
    //     "first_name": "کاربر",
    //     "last_name": "بدون سرور",
    // });

    mock.onGet("/user/me").reply(200, {
        "first_name": "کاربر",
        "last_name": "بدون سرور",
    });
}