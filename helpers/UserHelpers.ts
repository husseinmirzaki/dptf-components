export interface UserInfoInterface {
  first_name?: string;
  last_name?: string;
}

export function fullNameGenerator(obj?: UserInfoInterface) {
  console.log(obj);
  if (obj) {
    if (
      obj.first_name &&
      obj.last_name &&
      obj.first_name != "" &&
      obj.last_name != ""
    ) {
      return obj.first_name + " " + obj.last_name;
    }
  }
  return "بدون نام و نام خانوادگی";
}
