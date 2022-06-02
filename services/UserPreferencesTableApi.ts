import {ApiService} from "@/Defaults";

export class UserPreferencesTableApi extends ApiService {

    static baseUrl = 'user_preferences/';

    public static getTableSettings(tableName) {
        return this.post(this.url + `get_setting/`, {
            data: {
                key: `tables.${tableName}`,
            }
        })
    }

    public static setTableSettings(tableName, settings) {
        return this.post(this.url + `set_setting/`, {
            data: {
                key: `tables.${tableName}`,
                value: JSON.stringify(settings),
            }
        })
    }
}