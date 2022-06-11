enum Actions {
  // action types
  ADD_BODY_CLASSNAME = "addBodyClassName",
  REMOVE_BODY_CLASSNAME = "removeBodyClassName",
  ADD_BODY_ATTRIBUTE = "addBodyAttribute",
  REMOVE_BODY_ATTRIBUTE = "removeBodyAttribute",
  ADD_CLASSNAME = "addClassName",
  VERIFY_AUTH = "verifyAuth",
  LOGIN = "login",
  FINALIZE_LOGIN = "finalize",
  LOGOUT = "logout",
  REGISTER = "register",
  UPDATE_USER = "updateUser",
  ASK_NEW_TOKEN = "askNewToken",
  FORGOT_PASSWORD = "forgotPassword",
  SET_FORGOT_PASSWORD = "setForgotPassword",
  SET_BREADCRUMB_ACTION = "setBreadcrumbAction",
  SET_USER_ACTION = "setUserAction",
}

enum Mutations {
  // mutation types
  SET_CLASSNAME_BY_POSITION = "appendBreadcrumb",
  PURGE_AUTH = "logOut",
  SET_AUTH = "setAuth",
  SET_NEW_TOKEN = "setNewToken",
  SET_USER = "setUser",
  SET_PASSWORD = "setPassword",
  SET_ERROR = "setError",
  ADD_ERROR = "addError",
  SET_FORGOTTEN_USER = "setForgottenUserMutation",
  SET_BREADCRUMB_MUTATION = "setBreadcrumbMutation",
  SET_LAYOUT_CONFIG = "setLayoutConfig",
  RESET_LAYOUT_CONFIG = "resetLayoutConfig",
  OVERRIDE_LAYOUT_CONFIG = "overrideLayoutConfig",
  OVERRIDE_PAGE_LAYOUT_CONFIG = "overridePageLayoutConfig",
}

export { Actions, Mutations };
