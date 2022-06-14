import {ApiService} from "@/Defaults";

export class TokenService {

    static baseUrl = 'token/'

    static login(username: string, password: string) {
        return ApiService.post(`${ApiService.base_url}${TokenService.baseUrl}`, {
            data: {
                username,
                password
            },
            dont_set_header: true,
        })
    }

}