import { ApiService } from "@/Defaults";

class DataHistoryService extends ApiService {
  public static baseUrl = "data_history/";

  public static getBasicTableHistory(modelName) {
    return this.get(
      `${this.baseUrl}basic_table_info/?model_name=${encodeURIComponent(
        modelName
      )}`
    );
  }

  public static getPaginatedUserInformation(modelName, page = 1) {
    return this.get(
      `${this.baseUrl}user_information/?model_name=${encodeURIComponent(
        modelName
      )}&page=${page}`
    );
  }
}

export default DataHistoryService;
