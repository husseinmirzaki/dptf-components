import { Ref, ref, watch } from "vue";
import { UserApiService } from "@/custom/services/UserApiService";

export class  PermissionService {
  public static isCheckingForRole: Ref<boolean> = ref(false);
  public static roleCheckFailed: Ref<boolean> = ref(false);
  public static possibleRoles: Ref<Array<string>> = ref([]);

  public static updatePossibleRoles() {
    this.isCheckingForRole.value = true;
    UserApiService.getCurrentUserRoles().then(
      ({ data }) => {
        this.possibleRoles.value = data;
        console.log(data),
        this.isCheckingForRole.value = false;
        this.roleCheckFailed.value = false;
      },
      () => {
        this.roleCheckFailed.value = true;
        this.isCheckingForRole.value = false;
      }
    );
  }
}

/**
 * user must have input permissions
 * @param permission
 */
export function hasPerm(permission: string | Array<string>) {
  if (Array.isArray(permission)) {
    for (let i = 0; i < permission.length; i++) {
      if (!hasPerm(permission[i])) {
        return false;
      }
    }
    return true;
  }
  return PermissionService.possibleRoles.value.indexOf(permission) > -1;
}

/**
 * user may have any of permissions
 * @param permission
 */
export function hasAnyPerm(permission: string | Array<string>) {
  if (Array.isArray(permission)) {
    for (let i = 0; i < permission.length; i++) {
      if (hasPerm(permission[i])) {
        return true;
      }
    }
    return false;
  }
  return hasPerm(permission);
}

export function hasAnyRole() {
  return PermissionService.possibleRoles.value.length > 0;
}

export function isCheckingRole() {
  return PermissionService.isCheckingForRole.value;
}

export function onRoleCheckFinished(f: (e: Array<string>) => void) {
  if (!isCheckingRole()) {
    f(PermissionService.possibleRoles.value);
  } else {
    watch(PermissionService.isCheckingForRole, (e) => {
      f(PermissionService.possibleRoles.value);
    });
  }
}
