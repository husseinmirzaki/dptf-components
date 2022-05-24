import {App} from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/custom/core/services/JwtService";
import {AxiosResponse} from "axios";
import {Actions} from "@/custom/store/enums/StoreEnums";
import {VueInstanceService} from "@/custom/Defaults";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
    /**
     * @description property to share vue instance
     */
    public static vueInstance: App;

    // http://127.0.0.1:8000/api/

    public static base_url = "";
    public static baseUrl = "";

    public static get loginURL() {
        return this.base_url + "user/auth/login/";
    }

    public static get loginFinalizeURL() {
        return this.base_url + "user/auth/token/";
    }

    public static get refreshUrl() {
        return this.base_url + "user/auth/refresh/";
    }

    public static get verifyTokenUrl() {
        return this.base_url + "user/auth/verify/";
    }

    public static get forgetPasswordUrl() {
        return this.base_url + "user/auth/forgotten/";
    }

    public static get forgetPasswordResetUrl() {
        return this.base_url + "user/auth/reset_forgotten/";
    }

    public static get selectUrl() {
        return this.baseUrl + 'select/';
    }

    /**
     * @description initialize vue axios
     */
    public static init(app: App<Element>) {
        this.vueInstance = app;
        this.vueInstance.use(VueAxios, axios);
        this.vueInstance.axios.defaults.baseURL = this.base_url;
    }

    public static getAuthHeaders(): any {
        return {
            Authorization: `Bearer ${JwtService.getToken()}`,
        };
    }

    /**
     * Handles another request's token refresh or
     * logout
     * @param reqF
     * @param resolve
     * @param reject
     * @private
     */
    private static handleTokenRefresh(reqF, resolve, reject) {
        reqF().then((e) => {
            resolve(e)
        }, (result) => {
            if (result.response) {
                // try to find the error
                if (result.response.data && result.response.data['code'] == "user_not_validated") {
                    VueInstanceService.store.dispatch(Actions.LOGOUT);
                    VueInstanceService.showErrorMessage("کاربر هنوز فعال نشده")
                    reject(result);
                } else if (result.response.data && result.response.data['code'] == "user_inactive") {
                    VueInstanceService.store.dispatch(Actions.LOGOUT);
                    VueInstanceService.showErrorMessage("کاربر هنوز فعال نشده")
                    reject(result);
                } else if (result.response.data && result.response.data['code'] == "user_not_found") {
                    VueInstanceService.store.dispatch(Actions.LOGOUT);
                    VueInstanceService.showErrorMessage("کاربر هنوز فعال نشده")
                    reject(result);
                } else if ((result.response.status == 401 || result.response.status == 403)) {
                    VueInstanceService.store
                        .dispatch(Actions.ASK_NEW_TOKEN)
                        .then(() => {
                            this.handleTokenRefresh(reqF, resolve, reject);
                        })
                        .catch((e) => {
                            console.log("asked for new token", e);
                            if (e !== 1) {
                                reject(e);
                            }
                        });
                } else if (
                    result.response.data &&
                    result.response.data.errors &&
                    result.response.data.errors.length > 0
                ) {
                    const errors = result.response.data.errors;

                    // search for invalid_access_token
                    // findIndex fails sometimes for some
                    // unknown reasons
                    const found = errors.findIndex((d) => {
                        return d === "invalid_access_token" || d === "token_not_valid";
                    })

                    if (found > -1)
                        // we will ask for new token
                        VueInstanceService.store
                            .dispatch(Actions.ASK_NEW_TOKEN)
                            .then(() => {
                                this.handleTokenRefresh(reqF, resolve, reject);
                            })
                            .catch((e) => {
                                if (e !== 1) {
                                    reject(e);
                                }
                            });
                    else
                        // if we could not find invalid_access_token
                        // we will pass the error to user
                        reject(result);

                } else if (result.response.status >= 500 && result.response.status < 600) {
                    // tell user its server error
                    VueInstanceService.showErrorMessage(
                        "مشکلی در اتصال به سرور رخ داد",
                        "مشکل اتصال",
                        0
                    );
                } else {
                    reject(result);
                }
            } else {
                if (!result.response || !result.response.data) {
                    // internet issues
                    VueInstanceService.showErrorMessage(
                        "بنظر مشکلی در اتصال به اینترنت رخ داده است",
                        "مشکل اتصال",
                        0
                    );
                }
                reject(result);
            }

            return result
        });
    }

    /**
     * HandleReceivedError
     * Tries to convert received error to understandable
     * text for user
     * @param promise
     * @private
     */
    private static hre(promise) {
        promise.catch((e: any) => {
            if (e) {
                if (e.response.status === 400) {
                    Object.keys(e.response.data).forEach((objectKey) => {
                        e.response.data[objectKey].forEach((message) => {
                            message = VueInstanceService.vue.config.globalProperties["$t"](message);
                            VueInstanceService.showErrorMessage(message);
                        })
                    });
                }
            }
            return e;
        });
        return promise;
    }

    static wrap(func: () => Promise<any>) {
        return this.hre(
            new Promise((resolve, reject) => {
                this.handleTokenRefresh(func, resolve, reject);
            })
        )
    }

    /**
     * Parses and completes parameters
     * adds headers or remove them
     * @param params
     * @private
     */
    private static calcConf(params) {
        const conf = {};

        if (params) {

            if (params["dont_set_header"]) {
                conf["headers"] = {};
            } else {
                conf["headers"] = this.getAuthHeaders();
            }

            if (params["headers"]) {
                const headers = conf['headers'] || {};
                Object.keys(params["headers"]).forEach((e) => {
                    headers[e] = params["headers"][e];
                });
                conf['headers'] = headers;
            }

            if (params["params"]) {
                conf["params"] = params["params"];
            }
        } else {
            conf['headers'] = this.getAuthHeaders()
        }

        return conf;
    }


    /**
     * To avoid request data from sending
     * nonsense and easier way to pass data
     * @param params
     * @private
     */
    private static calcData(params: any) {
        if (params && params["data"]) {
            return params["data"];
        }
        return undefined;
    }

    /**
     * @description send the GET HTTP request
     * @param resource: string
     * @param params
     * @returns Promise<AxiosResponse>
     */
    public static get<T = any>(
        resource: string,
        params = {}
    ): Promise<AxiosResponse<T>> {
        return this.wrap(() => {
            return this.vueInstance.axios.get(resource, this.calcConf(params));
        });
    }

    /**
     * @description set the POST HTTP request
     * @param resource: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static post(resource: string, params: any | null = null): Promise<AxiosResponse> {
        return this.wrap(() => {
            return this.vueInstance.axios.post(
                `${resource}`,
                this.calcData(params),
                this.calcConf(params)
            );
        });
    }

    /**
     * @description set the PATCH HTTP request
     * @param resource: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    public static patch(resource: string, params: any): Promise<AxiosResponse> {
        return this.wrap(() => {
            return this.vueInstance.axios.patch(
                `${resource}`,
                this.calcData(params),
                this.calcConf(params)
            );
        });
    }

    /**
     * @description Send the DELETE HTTP request
     * @param resource: string
     * @param params
     * @returns Promise<AxiosResponse>
     */
    public static delete(resource: string, params = {}): Promise<AxiosResponse> {
        return this.wrap(() => {
            return this.vueInstance.axios.delete(resource, this.calcConf(params));
        });
    }

    public static getOne(id) {
        return this.get(this.baseUrl + `${id}/`)
    }

    public static deleteOne(id) {
        return this.delete(`${this.baseUrl}${id}/`);
    }

    public static createOne(data) {
        return this.post(`${this.baseUrl}`, {
            data: data
        });
    }

    public static updateOne(id, data) {
        return this.patch(`${this.baseUrl}${id}/`, {
            data: data
        });
    }


    public static get url() {
        return this.base_url + this.baseUrl;
    }
}

export default ApiService;
