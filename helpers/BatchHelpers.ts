import { ApiService } from "@/Defaults";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { UserApiService } from "@/custom/services/UserApiService";

export class BatchDeleteHelper {
  public static service = ApiService;
  public static title = "حدف داده های انتخابی";
  public static message = "در صورت تایید کلیه داده های انتخاب شده حذف میشود";
  public static deleteAllWarningTitle = "هشدار حذف تمام داده ها";
  public static deleteAllWarningMessage =
    "تمام داده های موجود در این جدول بشکل کامل حذف خواهد شد";

  public static async showDeleteAllMessage() {
    const modalResult = await Swal.fire({
      icon: "danger",
      title: this.title,
      text: this.message,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "حذف شود",
      cancelButtonText: `حذف نشود`,
      confirmButtonColor: "#F00",
      cancelButtonColor: "#0742c0",
    } as any);
    if (modalResult.isConfirmed) {
      return await this.deleteAll();
    }
    return null;
  }

  public static async showDeleteSomeMessage(someIds) {
    const modalResult = await Swal.fire({
      icon: "danger",
      title: this.title,
      text: this.message,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "حذف شود",
      cancelButtonText: `حذف نشود`,
      confirmButtonColor: "#F00",
      cancelButtonColor: "#0742c0",
    } as any);
    if (modalResult.isConfirmed) {
      return await this.deleteSome(someIds);
    }
    return null;
  }

  public static async deleteSome(ids) {
    //
  }

  public static async deleteAll() {
    //
  }
}
