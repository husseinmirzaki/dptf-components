import {ApiService} from "@/Defaults";

class AnyInformationService extends ApiService {
    public static baseName = 'any_information/'

    public static getListOfInformation(key) {
        return this.get(`${this.baseName}find_by_key/?key=${encodeURIComponent(key)}`);
    }

    public static addInformation(key, information) {
        return this.post(`${this.baseName}add_to_key/`, {
            data: {
                key,
                information: JSON.stringify(information),
            }
        });
    }

    public static removeInformation(id, key) {
        return this.post(`${this.baseName}remove_from_key/`, {
            data: {
                id,
                key,
            }
        });
    }

    public static saveInformation(id, information) {
        return this.post(`${this.baseName}save_information/`, {
            data: {
                id,
                information: JSON.stringify(information),
            }
        });
    }
}

export {AnyInformationService}