import { App } from "vue";
import axios, { AxiosResponse } from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/custom/core/services/JwtService";
import { Actions, Mutations } from "@/custom/store/enums/StoreEnums";
import { VueInstanceService } from "@/Defaults";
import { initMockAdapter } from "@/custom/mock/mock_server";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  public static get extraParams(): Record<string, any> {
    return {};
  }

  // http://127.0.0.1:8000/api/

  public static base_url = process.env.VUE_APP_BASE_URL;
  public static baseUrl = "";

  public static get loginURL() {
    return "user/auth/login/";
  }

  public static get loginFinalizeURL() {
    return "user/auth/token/";
  }

  public static get refreshUrl() {
    return "user/auth/refresh/";
  }

  public static get verifyTokenUrl() {
    return "user/auth/verify/";
  }

  public static get forgetPasswordUrl() {
    return "user/auth/forgotten/";
  }

  public static get forgetPasswordResetUrl() {
    return "user/auth/reset_forgotten/";
  }

  public static get selectUrl() {
    return this.baseUrl + "select/";
  }

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    this.vueInstance = app;
    this.vueInstance.use(VueAxios, axios);
    this.vueInstance.axios.defaults.baseURL = this.base_url;

    if (process.env.VUE_APP_FAKE_AXIOS == "1") {
      initMockAdapter(axios);
    }
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
    reqF().then(
      (e) => {
        resolve(e);
      },
      (result) => {
        VueInstanceService.store.commit(Mutations.SET_ERROR, []);
        if (result.response) {
          // try to find the error
          if (result.response.status == 400) {
            Object.keys(result.response.data).forEach((key) => {
              if (key == "exception") {
                VueInstanceService.store.commit(
                  Mutations.ADD_ERROR,
                  Array.isArray(result.response.data[key])
                    ? result.response.data[key][0]
                    : result.response.data[key]
                );
                return;
              } else if (key == "exceptions") {
                result.response.data[key].forEach((exception) => {
                  VueInstanceService.store.commit(
                    Mutations.ADD_ERROR,
                    exception
                  );
                });
                return;
              }

              if (Array.isArray(result.response.data[key])) {
                result.response.data[key].forEach((message) => {
                  VueInstanceService.showErrorMessage(message);
                });
              }
            });
            reject(result);
          } else if (
            result.response.data &&
            result.response.data["code"] == "user_not_validated"
          ) {
            VueInstanceService.store.dispatch(Actions.LOGOUT);
            VueInstanceService.showErrorMessage("کاربر هنوز فعال نشده");
            reject(result);
          } else if (
            result.response.data &&
            result.response.data["code"] == "user_inactive"
          ) {
            VueInstanceService.store.dispatch(Actions.LOGOUT);
            VueInstanceService.showErrorMessage("کاربر هنوز فعال نشده");
            reject(result);
          } else if (
            result.response.data &&
            result.response.data["code"] == "user_not_found"
          ) {
            VueInstanceService.store.dispatch(Actions.LOGOUT);
            VueInstanceService.showErrorMessage("کاربر هنوز فعال نشده");
            reject(result);
          } else if (
            result.response.status == 401 ||
            result.response.status == 403
          ) {
            if (result.response.code == "permission_denied") {
              VueInstanceService.router.push("/");
              VueInstanceService.showErrorMessage(
                "شما دسترسی به بخش درخواستی را ندارید"
              );
              return result;
            }
            VueInstanceService.store
              .dispatch(Actions.ASK_NEW_TOKEN)
              .then(() => {
                this.handleTokenRefresh(reqF, resolve, reject);
              })
              .catch((e) => {
                // console.log("asked for new token", e);
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
            });

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
            // if we could not find invalid_access_token
            // we will pass the error to user
            else reject(result);
          } else if (
            result.response.status >= 500 &&
            result.response.status < 600
          ) {
            // tell user its server error
            if (!VueInstanceService.ignoreServerError)
              VueInstanceService.showErrorMessage(
                "مشکلی در اتصال به سرور رخ داد",
                "مشکل اتصال",
                0
              );
            else VueInstanceService.ignoreServerError = false;
            reject(result);
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

        return result;
      }
    );
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
      if (e && e.response) {
        if (e.response.status === 400) {
          if (Array.isArray(e.response.data)) {
            Object.keys(e.response.data).forEach((objectKey) => {
              e.response.data[objectKey].forEach((message) => {
                message =
                  VueInstanceService.vue.config.globalProperties["$t"](message);
                VueInstanceService.showErrorMessage(message);
              });
            });
          }
        }
      }
      return e;
    });
    return promise;
  }

  static wrap(func: () => Promise<any>) {
    const promise = new Promise((resolve, reject) => {
      this.handleTokenRefresh(func, resolve, reject);
    });

    promise.then(() => {
      VueInstanceService.ignoreServerError = false;
    });

    return this.hre(promise);
  }

  /**
   * This method is called before every other
   * request and it tries to prepare required
   * request configurations from developer's
   * passed configurations
   *
   * `data` is a config which tells this method to send
   *        data to server when request is post
   * `headers` is a config which tells this method to send
   *        specific headers to server which could include
   *        authentication stuff
   * `dont_set_header` is a config which tells this method to
   *        avoid using authentication headers
   *
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
        const headers = conf["headers"] || {};
        Object.keys(params["headers"]).forEach((e) => {
          headers[e] = params["headers"][e];
        });
        conf["headers"] = headers;
      }

      if (params["params"]) {
        conf["params"] = params["params"];
      }

      if (params["responseType"]) {
        conf["responseType"] = params["responseType"];
      }
    } else {
      conf["headers"] = this.getAuthHeaders();
    }

    return conf;
  }

  public static fixUrlParams(resource) {
    const extraParams = Object.keys(this.extraParams);
    const urlEncode = new URLSearchParams();
    if (extraParams.length > 0) {
      extraParams.forEach((extraParam) => {
        urlEncode.append(extraParam, this.extraParams[extraParam]);
      });
      if (resource.search(/\?/) > -1) {
        if (resource.endsWith("&")) {
          resource += urlEncode.toString();
        } else {
          resource += `&${urlEncode.toString()}`;
        }
      } else {
        resource += `?${urlEncode.toString()}`;
      }
    }
    return resource;
  }

  /**
   * To avoid request data from sending
   * nonsense and easier way to pass data
   * @param params
   * @private
   */
  private static calcData(params: any) {
    if (Object.keys(this.extraParams).length > 0) {
      if (!params) {
        params = {};
      }

      if (!params["data"]) {
        params["data"] = {};
      }

      params["data"] = {
        ...params["data"],
        ...this.extraParams,
      };
      console.log(this.extraParams, params);
    }

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
    resource = this.fixUrlParams(resource);
    return this.wrap(() => {
      return this.vueInstance.axios.get(resource, this.calcConf(params));
    });
  }

  /**
   * @description send the OPTIONS HTTP request
   * @param resource: string
   * @param params
   * @returns Promise<AxiosResponse>
   */
  public static options<T = any>(
    resource: string,
    params = {}
  ): Promise<AxiosResponse<T>> {
    resource = this.fixUrlParams(resource);
    return this.wrap(() => {
      return this.vueInstance.axios.options(resource, this.calcConf(params));
    });
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(
    resource: string,
    params: any | null = null
  ): Promise<AxiosResponse> {
    if (params && params["data"] && params["data"] instanceof FormData) {
      if (!params["headers"]) {
        params["headers"] = {};
      }
      params["headers"]["content-type"] = "multipart/form-data";
    }

    const config = this.calcConf(params);
    // console.log(config);

    return this.wrap(() => {
      return this.vueInstance.axios.post(
        `${resource}`,
        this.calcData(params),
        config
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
    resource = this.fixUrlParams(resource);
    return this.wrap(() => {
      return this.vueInstance.axios.delete(resource, this.calcConf(params));
    });
  }

  public static list(
    customUrl: string | undefined = undefined,
    params: any = undefined
  ) {
    if (customUrl) return this.get(customUrl);
    return this.get(
      this.url,
      params
        ? {
            params,
          }
        : undefined
    );
  }

  public static getOne(id, params: any = undefined) {
    return this.get(
      this.baseUrl + `${id}/`,
      params
        ? {
            params,
          }
        : undefined
    );
  }

  public static deleteOne(id, params: any = undefined) {
    VueInstanceService.ignoreServerError = true;
    return this.delete(
      `${this.baseUrl}${id}/`,
      params
        ? {
            params,
          }
        : undefined
    );
  }

  public static deleteAll(params: any = undefined) {
    return this.delete(
      `${this.baseUrl}/all/`,
      params
        ? {
            params,
          }
        : undefined
    );
  }

  public static buildCreateOneUrl() {
    return this.baseUrl;
  }

  public static createOne(data) {
    return this.post(`${this.buildCreateOneUrl()}`, {
      data: data,
    });
  }

  public static buildUpdateOneUrl(id) {
    return `${this.baseUrl}${id}/`;
  }

  public static updateOne(id, data) {
    return this.patch(`${this.buildUpdateOneUrl(id)}`, {
      data: data,
    });
  }

  public static get url() {
    return this.baseUrl;
  }
}

export default ApiService;
