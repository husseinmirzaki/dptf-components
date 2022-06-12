/*
 * Parts done in this page
 *
 * 1. Login
 * 1.1 Saving token
 * 1.2 Creating Global uer instance
 * 2. Update
 * 2.1 Updates user information
 * 2.2 Updates user credentials
 * 3. Logout
 * 3.1 Removes existing Tokens
 * 3.2 Removes existing User instance
 *
 */


import {ApiService} from "@/custom/Defaults";
import JwtService from "@/custom/core/services/JwtService";
import {Actions, Mutations} from "@/custom/store/enums/StoreEnums";
import {Module, Action, Mutation, VuexModule} from "vuex-module-decorators";
import {VueInstanceService} from "@/custom/Defaults";
import {UserApiService} from "@/custom/services/UserApiService";
import {fullNameGenerator} from "@/custom/helpers/UserHelpers";

export interface User {
    avatar?: string
    email?: string
    first_name?: string
    gender?: string
    id?: number
    last_name?: string
    phone_number?: string
    password?: string
}

export interface UserAuthInfo {
    errors: Array<string>;
    user: User;
    isAuthenticated: boolean;
}

@Module
export default class AuthModule extends VuexModule implements UserAuthInfo {
    errors: Array<any> = [];
    user = {} as User;
    isAuthenticated = !!JwtService.getToken();

    forgottenUser = '';

    /**
     * Get current user object
     * @returns User
     */
    get currentUser(): User {
        return this.user;
    }

    get userFullName(): string {
        return fullNameGenerator(this.user);
    }

    get currentForgottenUser(): string {
        return this.forgottenUser;
    }


    /**
     * Verify user authentication
     * @returns boolean
     */
    get isUserAuthenticated(): boolean {
        return this.isAuthenticated;
    }

    /**
     * Get authentication errors
     * @returns array
     */
    get getErrors(): Array<string> {
        return this.errors;
    }

    /**
     * Saves last errors that occurred in auth
     * @param error
     */
    @Mutation
    [Mutations.SET_ERROR](error) {
        this.errors = error;
    }

    @Mutation
    [Mutations.ADD_ERROR](error) {
        this.errors.push(error);
    }

    @Mutation
    [Mutations.SET_FORGOTTEN_USER](user: string) {
        this.forgottenUser = user;
    }

    @Action
    [Actions.SET_USER_ACTION](data) {
        // console.log('ac', data)
        this.context.commit(Mutations.SET_USER, data);
    }

    /**
     * When this function called a string token is passed
     * this token contains user id
     * @param data
     */
    @Mutation
    [Mutations.SET_AUTH](data) {
        this.isAuthenticated = true;
        this.errors = [];
        JwtService.saveToken(JSON.stringify(data));
    }

    /**
     * When this function called a string token is passed
     * this token contains user id
     * @param data
     */
    @Mutation
    [Mutations.SET_NEW_TOKEN](data) {
        JwtService.setAccess(data['access'])
    }

    /**
     * This can be used to set new user data
     * @param user
     */
    @Mutation
    [Mutations.SET_USER](user) {
        this.user = user;
    }

    /**
     * Changes user password
     * @param password
     */
    @Mutation
    [Mutations.SET_PASSWORD](password) {
        this.user.password = password;
    }

    /**
     * Deletes all user data
     */
    @Mutation
    [Mutations.PURGE_AUTH]() {
        this.isAuthenticated = false;
        this.user = {} as User;
        this.errors = [];
        JwtService.destroyToken();
        localStorage.removeItem('activePostId');
    }

    /**
     * Tries to login user
     * @param credentials
     */
    @Action
    [Actions.LOGIN](credentials) {
        return new Promise<void>((resolve, reject) => {
            const response = ApiService.post(ApiService.loginURL, {
                data: credentials
            });
            // response.catch((e) => {
            //     console.log(e)
            //     reject(e);
            // });
            response.then(({data}) => {
                this.context.commit(Mutations.SET_AUTH, data)
                resolve(data);
            }, (e) => reject(e));
        });
    }

    /**
     * Passes token and logs in
     * @param credentials
     */
    @Action
    [Actions.FINALIZE_LOGIN](data) {
        return new Promise<void>((resolve, reject) => {
            ApiService.post(ApiService.loginFinalizeURL, {
                data: data
            })
                .then((e) => {
                    const data = e.data;
                    const loginData = data;
                    this.context.commit(Mutations.SET_AUTH, data);
                    this.context.dispatch(Actions.GET_ME).then(() => {
                        resolve(loginData);
                    }, ({response}) => {
                        this.context.commit(Mutations.PURGE_AUTH);
                        reject(response);
                    })
                }, (response) => {
                    reject(response);
                }).catch((e) => reject(e));
        });
    }
    @Action
    [Actions.GET_ME]() {
        return new Promise<void>((resolve, reject) => {
            UserApiService.getMe().then(({data}) => {
                this.context.commit(Mutations.SET_USER, data)
                resolve(data);
            }, ({response}) => {
                reject(response);
            });
        });
    }

    /**
     * Tries to logout user
     */
    @Action
    [Actions.LOGOUT]() {
        this.context.commit(Mutations.PURGE_AUTH);
        VueInstanceService.showSuccessMessage("شما با موفقیت خارج شدید");
        VueInstanceService.router.push({
            name: 'sign-in',
        });
    }

    /**
     * In case user forget password this function is called
     * @param payload
     */
    @Action
    [Actions.FORGOT_PASSWORD](payload) {
        return new Promise<void>((resolve, reject) => {
            ApiService.post(ApiService.forgetPasswordUrl, {data: payload})
                .then(() => {
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    }

    /**
     * Use this to set new password using received token
     * @param payload
     */
    @Action
    [Actions.SET_FORGOT_PASSWORD](payload) {
        return new Promise<void>((resolve, reject) => {
            ApiService.post(ApiService.forgetPasswordResetUrl, {data: payload})
                .then(() => {
                    this.context.commit(Mutations.SET_FORGOTTEN_USER, '');
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    }

    /**
     * Verifies current token
     */
    @Action
    [Actions.VERIFY_AUTH]() {
        // if (JwtService.getToken()) {
        //     ApiService.get(ApiService.verifyTokenUrl)
        //         .then(({data}) => {
        //             this.context.commit(Mutations.SET_AUTH, data);
        //         })
        //         .catch(({response}) => {
        //             this.context.commit(Mutations.SET_ERROR, response.data.errors);
        //         });
        // } else {
        //     this.context.commit(Mutations.PURGE_AUTH);
        // }
    }

    /**
     * Verifies current token
     */
    @Action
    [Actions.ASK_NEW_TOKEN]() {
        // console.log("asking for new token")
        return new Promise((resolve, reject) => {
            const token = JwtService.getRefresh();
            if (token) {
                ApiService.post(ApiService.refreshUrl, {
                    dont_set_header: true,
                    data: {
                        refresh: token,
                    }
                })
                    .then((response) => {
                        if (!response) {
                            this.context.commit(Mutations.PURGE_AUTH);
                            VueInstanceService.router.push('/sign-in');
                            reject();
                            return;
                        }
                        // console.log("setting new token")
                        if (response.data) {
                            this.context.commit(Mutations.SET_NEW_TOKEN, response.data);
                            resolve(response.data);
                        }
                    }, (e) => {
                        // console.log("e.response", e && e.response && e.response.auth && e.response.data);
                        if (
                            e &&
                            e.response
                            && e.response.data && !Array.isArray(e.response.data) &&
                            (e.response.data.auth && e.response.data.auth == 'invalid_refresh_token')
                        ) {
                            this.context.commit(Mutations.PURGE_AUTH);
                            VueInstanceService.showSuccessMessage("شما با موفقیت خارج شدید");
                            VueInstanceService.router.push({
                                name: 'sign-in',
                            });
                        } else {
                            reject(e);
                        }
                    });
            } else {
                this.context.commit(Mutations.PURGE_AUTH);
            }
        })
    }
}
