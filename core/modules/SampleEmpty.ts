import { Actions, Mutations } from "@/custom/store/enums/StoreEnums";
import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";

@Module
export default class AuthModule extends VuexModule {
  sampleData: Array<string> = [];

  /**
   * sample
   */
  get sampleGetter(): Array<string> {
    return this.sampleData;
  }

  /**
   * sample
   */
  @Mutation
  [Mutations.SET_ERROR](data) {
    this.sampleData = data;
  }

  /**
   * sample
   */
  @Action
  [Actions.LOGIN](payload) {
    //
  }
}
