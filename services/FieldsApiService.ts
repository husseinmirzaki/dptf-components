import { ApiService } from '@/Defaults';

class FieldsApiService extends ApiService {
  static baseUrl = 'fields/';

  public static getFieldsConfig(modelName: string) {
    return this.get(
      `${this.baseUrl}fields/?model_name=${encodeURIComponent(modelName)}`
    );
  }

  public static getFieldConfig(modelName: string, fieldName: string) {
    return this.get(
      `${this.baseUrl}field/?model_name=${encodeURIComponent(
        modelName
      )}&field_name=${fieldName}`
    );
  }
}

export { FieldsApiService };
