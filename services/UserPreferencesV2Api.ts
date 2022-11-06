import { ApiService } from '@/Defaults';
import { ref } from 'vue';

export class UserPreferencesManager {
  public loadingPreferences = ref(false);
  public value = ref();
  private title: any;

  constructor(title) {
    this.title = title;
  }

  public get() {
    this.loadingPreferences.value = true;
    return UserPreferencesV2Api.getPreferences(this.title).then(
      ({ data }) => {
        this.value.value = JSON.parse(data.value);
        this.loadingPreferences.value = false;
      },
      () => (this.loadingPreferences.value = false)
    );
  }

  public set(value) {
    UserPreferencesV2Api.setPreferences(this.title, value);
  }
}

export class UserPreferencesV2Api extends ApiService {
  static baseUrl = 'user/preference/';

  public static getPreferences(key) {
    return this.get(this.baseUrl + `get_item/?key=${encodeURI(key)}`);
  }

  public static setPreferences(key, value) {
    return this.post(this.baseUrl + `set_item/`, {
      data: {
        key,
        value: JSON.stringify(value),
      },
    });
  }
}
