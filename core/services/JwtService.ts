const ID_TOKEN_KEY = "id_token" as string;

/**
 * @description get token form localStorage
 */
export const getToken = (): string | null => {
    try {
        const token = window.localStorage.getItem(ID_TOKEN_KEY);
        if (token)
            return JSON.parse(token)['access'];
    } catch (e) {
        //
    }
    return null;
};

/**
 * @description get token form localStorage
 */
export const setAccess = (_token) => {
    const token = window.localStorage.getItem(ID_TOKEN_KEY);
    if (token) {
        const d = JSON.parse(token);
        d['access'] = _token
        window.localStorage.setItem(ID_TOKEN_KEY, JSON.stringify(d));
    }
};

/**
 * @description get token form localStorage
 */
export const getRefresh = (): string | null => {
    const token = window.localStorage.getItem(ID_TOKEN_KEY);
    if (token)
        return JSON.parse(token)['refresh'];
    return null;
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: string): void => {
    window.localStorage.setItem(ID_TOKEN_KEY, token);
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
    window.localStorage.removeItem(ID_TOKEN_KEY);
};

export default {getToken, saveToken, destroyToken, getRefresh, setAccess};
